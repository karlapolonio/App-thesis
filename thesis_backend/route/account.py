from fastapi import APIRouter, HTTPException, status
from database.supabase_connection import supabase
from schemas import UserCreate, UserLogin, UserResponse, LoginResponse
from passlib.context import CryptContext

router = APIRouter(prefix="/account", tags=["Account"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Register account
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    response = (
        supabase.table("users")
        .select("*")
        .eq("email", user.email)
        .execute()
    )
    if response.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user_resp = supabase.table("users").insert({
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password)
    }).execute()

    if not new_user_resp.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    new_user = new_user_resp.data[0]
    return UserResponse(
        id=new_user["id"],
        username=new_user["username"],
        email=new_user["email"]
    )

# Login account
@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin):

    response = supabase.table("users").select("*").eq("email", user.email).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    db_user = response.data[0]

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    profile_resp = (
        supabase.table("user_profile_data")
        .select("*")
        .eq("user_id", db_user["id"])
        .execute()
    )
    has_profile = bool(profile_resp.data)

    return LoginResponse(
        user=UserResponse(
            id=db_user["id"],
            username=db_user["username"],
            email=db_user["email"]
        ),
        has_profile=has_profile
    )