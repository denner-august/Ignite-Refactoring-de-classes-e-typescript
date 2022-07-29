import { createRef } from "react";
import { FiCheckSquare } from "react-icons/fi";

import { Form } from "./styles";
import Modal from "../Modal";
import Input from "../Input";

type foodProps = {
  description: string;
  image: string;
  name: string;
  price: string;
};

type editFood = {
  isOpen: boolean;
  setIsOpen: () => void;
  editingFood: () => void;
  handleUpdateFood: (data: foodProps) => void;
};

export default function ModalEditFood({
  isOpen,
  editingFood,
  setIsOpen,
  handleUpdateFood,
}: editFood) {
  const handleSubmit = async (data: foodProps) => {
    handleUpdateFood(data);
    setIsOpen();
  };

  const formRef: any = createRef();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}
