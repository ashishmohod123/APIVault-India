import uvicorn

if __name__ == "__main__":
    print("[+] Starting APIVault India Gateway Server on http://0.0.0.0:8000 ...")
    print("[+] Swagger API Documentation: http://127.0.0.1:8000/docs")
    print("[+] Mobile / LAN Gateway Access: http://172.20.10.2:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
