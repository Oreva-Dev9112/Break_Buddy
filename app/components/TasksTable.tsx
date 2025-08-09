/**
 * Tasks table (mocked)
 *
 * Renders a basic table for "today's" tasks. This is a placeholder view to
 * demonstrate table styling and could be fed by real data later.
 */
interface Task {
  id: string;
  department: string;
  stage: string;
  assigned: string;
  team: string;
  date: string;
  status: 'Pending' | 'Done' | 'Testing';
}

const mockTasks: Task[] = [
  {
    id: '1',
    department: 'Travel Planning',
    stage: 'Development',
    assigned: 'David',
    team: 'Trip App',
    date: '12-09-2024',
    status: 'Pending'
  },
  {
    id: '2',
    department: 'Hotel Booking',
    stage: 'Testing Phase',
    assigned: 'Mike',
    team: 'Booking Dev',
    date: '12-09-2024',
    status: 'Done'
  },
  {
    id: '3',
    department: 'Flight Search',
    stage: 'Development',
    assigned: 'Sarah',
    team: 'Flight Team',
    date: '12-09-2024',
    status: 'Testing'
  }
];

const StatusBadge = ({ status }: { status: Task['status'] }) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Done: 'bg-green-100 text-green-800 border-green-200',
    Testing: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status}
    </span>
  );
};

export default function TasksTable() {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Today&apos;s Tasks</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Department</th>
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Stage</th>
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Assigned</th>
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Team</th>
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Date</th>
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Status</th>
              <th className="text-left py-4 px-2 text-purple-200 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map((task) => (
              <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-xs text-white">
                        A
                      </div>
                      <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white flex items-center justify-center text-xs text-white">
                        B
                      </div>
                    </div>
                    <span className="text-white font-medium">{task.department}</span>
                  </div>
                </td>
                <td className="py-4 px-2 text-purple-200">{task.stage}</td>
                <td className="py-4 px-2 text-purple-200">{task.assigned}</td>
                <td className="py-4 px-2 text-purple-200">{task.team}</td>
                <td className="py-4 px-2 text-purple-200">{task.date}</td>
                <td className="py-4 px-2">
                  <StatusBadge status={task.status} />
                </td>
                <td className="py-4 px-2">
                  <button className="text-purple-200 hover:text-white">⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 