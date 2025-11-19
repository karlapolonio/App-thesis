from fastapi import APIRouter, HTTPException
from database.supabase_connection import supabase
from schemas import MealCreate, MealResponse
from datetime import datetime, timezone, timedelta
from typing import List

router = APIRouter(
    prefix="/meal",
    tags=["Meal"]
)

@router.post("/", response_model=MealResponse)
def create_meal(meal: MealCreate):
    try:
        meal_time = meal.created_at or datetime.now(timezone.utc)

        response = supabase.table("meal").insert({
            "user_id": meal.user_id,
            "total_calories": meal.total_calories,
            "total_protein": meal.total_protein,
            "total_carbs": meal.total_carbs,
            "total_fat": meal.total_fat,
            "meal_type": meal.meal_type,
            "created_at": meal_time.isoformat()
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create meal")

        return response.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[MealResponse])
def get_meals_by_date(
    user_id: int,
    date: str 
):
    try:
        start = datetime.fromisoformat(date)
        end = start + timedelta(days=1)

        response = (
            supabase.table("meal")
            .select("*")
            .eq("user_id", user_id)
            .gte("created_at", start.isoformat())
            .lt("created_at", end.isoformat())
            .execute()
        )

        return response.data or []

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{meal_id}", response_model=dict)
def delete_meal(meal_id: int):
    try:
        response = supabase.rpc("delete_meal_with_logs", {"p_meal_id": meal_id}).execute()
        print(response)
        return {"message": "Meal and its food logs deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
