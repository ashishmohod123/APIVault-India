from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate developer credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. Only Ashish Mohod (Platform Admin) can access this resource."
        )
    return current_user

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
        role=user_in.role or UserRole.DEVELOPER,
        organization=user_in.organization or "Independent Developer",
        location_city=user_in.location_city or "Nagpur",
        country=user_in.country or "India"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": user.email, "role": user.role.value})
    return TokenResponse(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.get("/demo-accounts")
def get_demo_accounts(db: Session = Depends(get_db)):
    """Returns demo accounts for 1-click login testing"""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role.value,
            "organization": u.organization,
            "location_city": u.location_city
        }
        for u in users
    ]
