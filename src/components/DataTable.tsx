import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface DataTableProps {
  profiles: Profile[];
  onEdit: (profile: Profile) => void;
  onDelete: (profileId: string) => void;
}

export function DataTable({ profiles, onEdit, onDelete }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.name}</TableCell>
            <TableCell>{profile.email}</TableCell>
            <TableCell>{profile.address.city}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(profile)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(profile.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
