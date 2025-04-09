import { useParams } from "react-router-dom";
import AtendeeRegister from "./AtendeeRegister";
import ManagerRegister from "./ManagerRegister";

export default function Register() {
  const { role } = useParams();

  if (role === "attendee") return <AtendeeRegister />;
  if (role === "manager") return <ManagerRegister />;

  return (
    <div className="text-center text-red-500 mt-4">
      Invalid registration type
    </div>
  );
}
