// import { Badge } from "lucide-react"; // Unused

interface UserRoleBadgeProps {
    role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'editor':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
}
