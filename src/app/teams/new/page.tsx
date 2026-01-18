import Link from 'next/link';
import { TeamForm } from '@/components/teams/TeamForm';

export default function NewTeamPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/teams" className="hover:text-gray-900">Teams</Link>
          <span>/</span>
          <span>New Team</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Team</h1>
        <p className="text-gray-600 mt-1">Add a new team to track statistics</p>
      </div>

      <TeamForm />
    </div>
  );
}
