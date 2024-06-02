import { useEffect, useState } from 'react';
import { FaPlus, FaRegTimesCircle, FaUndo } from 'react-icons/fa';

export default function AddSalary() {
  const [basicSalary, setBasicSalary] = useState(() => {
    const savedBasicSalary = localStorage.getItem('basicSalary');
    return savedBasicSalary ? parseFloat(savedBasicSalary) : 0;
  });
  const [earnings, setEarnings] = useState(() => {
    const savedEarnings = JSON.parse(localStorage.getItem('earnings')) || [];
    return savedEarnings;
  });
  const [deductions, setDeductions] = useState(() => {
    const savedDeductions = JSON.parse(localStorage.getItem('deductions')) || [];
    return savedDeductions;
  });

  useEffect(() => {
    localStorage.setItem('basicSalary', basicSalary);
  }, [basicSalary]);

  useEffect(() => {
    localStorage.setItem('earnings', JSON.stringify(earnings));
  }, [earnings]);

  useEffect(() => {
    localStorage.setItem('deductions', JSON.stringify(deductions));
  }, [deductions]);


  const handleAddAllowance = () => {
    setEarnings([...earnings, { title: '', amount: 0, epfEtf: false }]);
  };

  const handleRemoveAllowance = (index) => {
    setEarnings(earnings.filter((_, i) => i !== index));
  };

  const handleAllowanceChange = (index, key, value) => {
    
    const updatedEarnings = [...earnings];
    updatedEarnings[index][key] = value;
    setEarnings(updatedEarnings);
  };

  const handleAddDeduction = () => {
    setDeductions([...deductions, { title: '', amount: 0 }]);
  };

  const handleRemoveDeduction = (index) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const handleDeductionChange = (index, key, value) => {
    const updatedDeductions = [...deductions];
    updatedDeductions[index][key] = value;
    setDeductions(updatedDeductions);
  };

  const totalEarnings = basicSalary + earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalEarningsForEPF = basicSalary + earnings.filter(e => e.epfEtf).reduce((sum, e) => sum + e.amount, 0);
  const grossDeduction = deductions.reduce((sum, d) => sum + d.amount, 0);
  const grossEarnings = totalEarnings - grossDeduction;
  const grossSalaryForEPF = totalEarningsForEPF - grossDeduction;
  const employeeEPF = grossSalaryForEPF * 0.08;
  const employerEPF = grossSalaryForEPF * 0.12;
  const employerETF = grossSalaryForEPF * 0.03;

  
  let APIT = 0;
  if (grossEarnings > 308333) {
    APIT = grossEarnings * 0.36 - 73500;
  } else if (grossEarnings > 266667) {
    APIT = grossEarnings * 0.30 - 55000;
  } else if (grossEarnings > 225000) {
    APIT = grossEarnings * 0.24 - 39000;
  } else if (grossEarnings > 183333) {
    APIT = grossEarnings * 0.18 - 25500;
  } else if (grossEarnings > 141667) {
    APIT = grossEarnings * 0.12 - 14500;
  } else if (grossEarnings > 100000) {
    APIT = grossEarnings * 0.06 - 6000;
  } else {
    APIT = 0;
  }

  const netSalary = grossEarnings - employeeEPF - APIT;
  const CTC = grossEarnings + employerEPF + employerETF;

  return (
    <div className='flex flex-col lg:flex-row m-4 lg:m-12 ' style={{ fontFamily: 'Robin, sans-serif' }}>
      <div className="max-w-full mx-auto p-6 bg-slate-100 rounded-lg shadow-md border mb-4 lg:mb-0 lg:mr-4">
        <div className='flex justify-between items-center mb-4'>
          <h2 className="text-2xl font-bold mb-4 text-center">Calculate Your Salary</h2>
          <button
            onClick={() => {
              setBasicSalary(0);
              setEarnings([{ title: '', amount: 0, epfEtf: false }]);
              setDeductions([{ title: '', amount: 0 }]);
            }}
            className="flex items-center text-blue-500 "
          >
            <div className='m-1 text-lg'><FaUndo /></div>
            Reset
          </button>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-1/2 lg:pr-2">
            <label className="block text-lg font-semibold mb-2">Basic Salary</label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(parseFloat(e.target.value))}
              className="border p-2 mb-4 w-full lg:w-72"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">Earnings</h3>
              {earnings.map((allowance, index) => (
                <div key={index} className="mb-2">
                  <div className='flex flex-col lg:flex-row justify-between'>
                    <input
                      type="text"
                      placeholder="Pay Details (Title)"
                      value={allowance.title}
                      onChange={(e) => handleAllowanceChange(index, 'title', e.target.value)}
                      className="border p-2 mb-2 lg:mb-0 lg:mr-2 w-full lg:w-36"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={allowance.amount}
                      onChange={(e) => handleAllowanceChange(index, 'amount', parseFloat(e.target.value))}
                      className="border p-2 mb-2 lg:mb-0 lg:mr-2 w-full lg:w-36"
                    />
                    <button onClick={() => handleRemoveAllowance(index)} className="text-slate-500 text-lg mb-2 lg:mb-0"><FaRegTimesCircle /></button>
                    <input
                      type="checkbox"
                      checked={allowance.epfEtf}
                      onChange={(e) => handleAllowanceChange(index, 'epfEtf', e.target.checked)}
                      className="mr-2 mx-4 bg-blue-500 w-10"
                    />
                    <span className='m-2'>EPF/ETF</span>
                  </div>
                </div>
              ))}
              <button onClick={handleAddAllowance} className="text-blue-500 p-2 rounded">
                <div className='flex items-center'><FaPlus /><span className='mx-2 -mt-1'>Add New Allowance</span></div>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Deductions</h3>
              {deductions.map((deduction, index) => (
                <div key={index} className="mb-2">
                  <div className='flex flex-col lg:flex-row justify-between'>
                    <input
                      type="text"
                      placeholder="Deduction (Title)"
                      value={deduction.title}
                      onChange={(e) => handleDeductionChange(index, 'title', e.target.value)}
                      className="border p-2 mb-2 lg:mb-0 lg:mr-2 w-full lg:w-36"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={deduction.amount}
                      onChange={(e) => handleDeductionChange(index, 'amount', parseFloat(e.target.value))}
                      className="border p-2 mb-2 lg:mb-0 lg:mr-2 w-full lg:w-36"
                    />
                    <button onClick={() => handleRemoveDeduction(index)} className="text-slate-500 text-lg mb-2 lg:mb-0"><FaRegTimesCircle /></button>
                  </div>
                </div>
              ))}
              <button onClick={handleAddDeduction} className="text-blue-500 p-2 rounded">
                <div className='flex items-center'><FaPlus /><span className='mx-2 -mt-1'>Add New Deduction</span></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-96 mx-auto p-6 bg-white rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold mb-2">Your Salary</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-sm font-semibold text-gray-600">Items</th>
              <th className="text-right text-sm font-semibold text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left text-base font-normal"><br/>Basic Salary</td>
              <td className="text-right text-base font-normal"><br/>{basicSalary.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="text-left text-base font-normal">Gross Earnings</td>
              <td className="text-right text-base font-normal">{totalEarnings.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="text-left text-base font-normal">Gross Deduction</td>
              <td className="text-right text-base font-normal">- {grossDeduction.toFixed(2)}</td>
            </tr>
         
            <tr>
              <td className="text-left text-base font-normal">Employee EPF (8%)</td>
              <td className="text-right text-base font-normal">{employeeEPF.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="text-left text-base font-normal">APIT</td>
              <td className="text-right text-base font-normal">- {APIT.toFixed(2)}</td>
            </tr>
            <tr className='' >
              <td className="text-left text-base font-bold"><br/>Net Salary(Take Home)</td>
              <td className="text-right text-base font-bold"><br/>{netSalary.toFixed(2)}</td>
            </tr>
            <tr >
              <td className="text-left text-base font-normal"><br/>Employer EPF (12%)</td>
              <td className="text-right text-base font-normal"><br/>{employerEPF.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="text-left text-base font-normal">Employer ETF (3%)</td>
              <td className="text-right text-base font-normal">{employerETF.toFixed(2)}</td>
            </tr>
            
          
            <tr>
              <td className="text-left text-base font-normal">CTC(Cost to Company)</td>
              <td className="text-right text-base font-normal">{CTC.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}