from fastapi import APIRouter, HTTPException, Query
from database.supabase_connection import supabase
from schemas import LogFoodRequest, LogFoodResponse
from typing import List

router = APIRouter(
    prefix="/log_food",
    tags=["Log Food"]
)

@router.post("/")
def create_food_log(request: LogFoodRequest):
    try:
        food_entries = []

        for food in request.foods:
            response = supabase.table("log_food").insert({
                "user_id": request.user_id,
                "meal_id": request.meal_id,
                "food_name": food.food_name,
                "serving_size_grams": food.serving_size_grams,
                "calories": food.calories,
                "protein": food.protein,
                "carbs": food.carbs,
                "fat": food.fat,
                "meal_type": food.meal_type 
            }).execute()

            if not response.data:
                raise HTTPException(status_code=500, detail=f"Failed to log food: {food.food_name}")
            
            food_entries.append(response.data[0])

        return {"message": "Food log(s) created successfully", "count": len(food_entries)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[LogFoodResponse])
def get_food_logs_by_meal(meal_id: int = Query(...),user_id: int = Query(...)):
    try:
        response = (
            supabase.table("log_food")
            .select("*")
            .eq("meal_id", meal_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
