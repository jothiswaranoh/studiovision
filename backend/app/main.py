from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import execute

app = FastAPI(
    title="Visual Programming Platform API",
    description="Backend API for the Visual Programming Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(execute.router)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Visual Programming Platform API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
