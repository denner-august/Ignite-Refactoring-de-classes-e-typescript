import Header from "../../components/Header/index";
import api from "../../services/api";
import Food from "../../components/Food/index";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useEffect, useState } from "react";

type foodOptions = {
  foods: any[];
  editingFood?: { id?: string | number };
  modalOpen?: boolean;
  editModalOpen: boolean;
};

export default function Dashboard() {
  const [foodOptions, setFoodOptions] = useState<foodOptions>({
    foods: [],
    editingFood: {},
    modalOpen: false,
    editModalOpen: false,
  });

  useEffect(() => {
    async function foods() {
      const response = await api.get("/foods");
      setFoodOptions({
        foods: response.data,
        editModalOpen: false,
      });
    }

    foods();
  }, []);

  const handleAddFood = async (food: any) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoodOptions({
        foods: [...foodOptions.foods, response.data],
        editModalOpen: foodOptions.editModalOpen,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: any) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${foodOptions.editingFood?.id}`,
        {
          ...foodOptions.editingFood,
          ...food,
        }
      );

      const foodsUpdated = foodOptions.foods?.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoodOptions({
        foods: foodsUpdated,
        editModalOpen: foodOptions.editModalOpen,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: any) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foodOptions.foods?.filter(
      (food: { id: number | string }) => food.id !== id
    );

    setFoodOptions({ foods: foodsFiltered, editModalOpen: false });
  };

  const toggleModal = () => {
    setFoodOptions({
      modalOpen: !foodOptions.modalOpen,
      editModalOpen: false,
      foods: foodOptions.foods,
    });
  };

  const toggleEditModal = () => {
    setFoodOptions({
      editModalOpen: !foodOptions.editModalOpen,
      foods: foodOptions.foods,
    });
  };

  const handleEditFood = (food: any) => {
    setFoodOptions({
      editingFood: food,
      editModalOpen: true,
      foods: foodOptions.foods,
    });
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={foodOptions.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={foodOptions.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={foodOptions.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foodOptions.foods &&
          foodOptions.foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
