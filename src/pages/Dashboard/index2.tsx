import Header from "../../components/Header/index";
import api from "../../services/api";
import Food from "../../components/Food/index";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useEffect, useState } from "react";

type foodOptions = {
  foods: any[];
  editingFood?: {};
  modalOpen?: false;
  editModalOpen?: false;
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
      setFoodOptions({ foods: response.data });
    }

    foods();
  }, []);

  const handleAddFood = async (food: any) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoodOptions({ foods: [...foodOptions.foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
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
