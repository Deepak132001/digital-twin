// src/pages/Dashboard.jsx
const Dashboard = () => {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Total Followers</h2>
          <p className="text-xl md:text-2xl">0</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Total Posts</h2>
          <p className="text-xl md:text-2xl">0</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Engagement Rate</h2>
          <p className="text-xl md:text-2xl">0%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;