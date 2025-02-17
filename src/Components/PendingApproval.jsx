const { ChevronRight } = require("lucide-react");
const { default: DashboardCard } = require("./Dashboardcard");

 export const PendingApproval = () => {
    const items = [
      { type: 'Helper', count: '10' },
      { type: 'Rental Request', count: '' },
      { type: 'Support Ticket', count: '32' }
    ];
  
    return (
      <DashboardCard>
        <div className="space-y-6">
          <h2 className="text-[16px] text-gray-900 font-medium">Pending Approval</h2>
  
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} 
                className="flex justify-between items-center py-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-gray-900" style={{color:'#333333'}}>{item.type}</span>
                  {item.count && (
                    <span className="px-2.5 py-0.5 bg-blue-500 text-white text-sm rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    );
  };