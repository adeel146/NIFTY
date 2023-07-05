import React from "react";

const BillingView = () => {
  return (
    <div>
      <div className="w-full h-[100vh] overflow-auto">
        <div className="group relative">
          <button className="self-left text-[20px] font-bold whitespace-nowrap dark:text-[#4c4c4c] px-7 pb-6 pt-5 flex">
            M.Ibrahim: Billing
          </button>
        </div>
        <hr />
        <div>
          <section className="  p-8">
            <h2 className="text-[12px] font-medium mb-3">YOUR CURRENT PLAN</h2>
            <div className="flex border w-[600px]">
              <div className="w-1/2 p-4">
                <p className="text-justify">
                  You’re on the Business trial plan. Your free trial will end on
                  Jun 12, 2023
                </p>
                <div className="ml-6">
                  <button className=" border rounded-lg text-white flex bg-[#00ac9e]    p-2 pl-8 pr-8 mt-8">
                    Change Plan
                  </button>
                </div>
              </div>
              <div className="w-1/2 p-4 border bg-[#fafbfd] text-[#a59dc1] text-[12px]">
                <p>USED: 1.21 MB TOTAL: 1 TB</p>
                <hr className="my-4" />
                <p> MEMBERS:1</p>
                <hr className="my-4" />
                <p>ACTIVE PROJECTS:3</p>
              </div>
            </div>
            <div>
              <div>
                <h5 className="text-[#50575d] text-sm font-medium mt-4">
                  BILLING INFO
                </h5>
                <button className=" border rounded-lg text-white flex bg-[#00ac9e]  gap-1 p-2 pl-6 pr-6  mt-2">
                  {" "}
                  Add Payment Method
                </button>
              </div>
              <div className="mb-2">
                <h5 className="text-[#50575d] text-sm font-medium mt-8">
                  Billing History
                </h5>
                <button className=" border rounded-lg flex bg-white p-2 pl-6 pr-6  mt-2">
                  {" "}
                  Add invoice details
                </button>
              </div>
              <div className="w-[500px]">
                <hr />
                <table className="">
                  <tbody>
                    <tr className=" text-[#2f2f30]">
                      <th>Date</th>
                      <th>Amount</th>
                    </tr>
                    <tr>
                      <td>
                        <time>05/29/2023</time>
                      </td>
                      <td>
                        <span className="p-8 mr-8">$0.00</span>
                      </td>
                      <td>
                        <span className="ml-4">Download Invoice</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
            </div>
          </section>
        </div>
        <hr />
        <div className="text-[16px] font-medium ml-5 mb-3 text-[#2f2f30] mt-3">
          <h2>Transfer Billing Ownership</h2>
          <p className="text-[14px] text-[#2f2f30] mt-2">
            The billing owner is the only person who can manage the plan and
            billing details. You can transfer the billing management to another
            user on the workspace.
          </p>
        </div>
        {/* dajisjfdoij */}
        
      </div>
    </div>
  );
};

export default BillingView;
