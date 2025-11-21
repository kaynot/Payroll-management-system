import { type FC, useState } from "react";
import { Button } from "../../ui/button";
import { useAuth } from "../../../context/AuthContext";
import { useHR } from "../../../context/HRContext";
import { useCrudFunc } from "../../hooks/crud";
import { Trash2 } from "lucide-react";

interface DeleteEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  employeeName: string;
}

export const DeleteEmployeeModal: FC<DeleteEmployeeModalProps> = ({
  open,
  onClose,
  employeeId,
  employeeName,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { refreshEmployees } = useHR();
  const [, , , , deleteData] = useCrudFunc();

  const handleDelete = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await deleteData(`Employee/${employeeId}`);
      await refreshEmployees();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] max-w-[90%] p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <Trash2 size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Delete Employee
          </h2>
        </div>

        {/* Body */}
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-800">{employeeName}</span>?
          <br />
          <br />
          This action{" "}
          <span className="font-semibold text-red-500">cannot be undone</span>.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="px-5 py-2 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};
