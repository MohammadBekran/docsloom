import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IUserAccessSelectorProps {
  value?: string;
  disabled?: boolean;
  onValueChange: (userType: string) => void;
}

const UserAccessSelector = ({
  value,
  disabled,
  onValueChange,
}: IUserAccessSelectorProps) => {
  return (
    <Select value={value} disabled={disabled} onValueChange={onValueChange}>
      <SelectTrigger className="w-fit min-w-[100px] border-none outline-none bg-transparent text-blue-100">
        <SelectValue placeholder="can view" />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200 text-white">
        <SelectItem value="viewer" className="share-select-item">
          can view
        </SelectItem>
        <SelectItem value="editor" className="share-select-item">
          can edit
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserAccessSelector;
