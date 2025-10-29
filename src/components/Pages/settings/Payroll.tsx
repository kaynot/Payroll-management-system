export const Payroll = () => {
  return (
    <section className="flex flex-col gap-4">
      <section className="bg-card border rounded-lg p-6 flex flex-col gap-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Tax Configuration</h3>
        <div className="grid flex-col gap-4 grid-cols-1">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="income-tax" className="text-sm font-medium">
                Income Tax Rate (%)
              </label>
              <input
                type="number"
                name="income-tax"
                id="income-tax"
                autoComplete="off"
                className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
              />
              <p className="text-start text-muted-foreground text-[12px]">
                Standard income tax percentage
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-ssnit" className="text-sm font-medium">
                  SSNIT Employee Contribution (%)
                </label>
                <input
                  type="number"
                  name="employee-ssnit"
                  id="employee-ssnit"
                  autoComplete="off"
                  className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employer-ssnit" className="text-sm font-medium">
                  SSNIT Employer Contribution (%)
                </label>
                <input
                  type="number"
                  name="employer-ssnit"
                  id="employer-ssnit"
                  autoComplete="off"
                  className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* allowances */}
      <section className="bg-card border rounded-lg p-6 flex flex-col gap-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Tax Configuration</h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-4 md:gap-3 lg:gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="transport-allowance"
              className="text-sm font-semibold"
            >
              Transport Allowance (GH₵)
            </label>
            <input
              type="number"
              name="transport-allowance"
              id="transport-allowance"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="house-allowance" className="text-sm font-semibold">
              Housing Allowance (GH₵)
            </label>
            <input
              type="number"
              name="house-allowance"
              id="house-allowance"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fuel-allowance" className="text-sm font-semibold">
              Fuel Allowance (GH₵)
            </label>
            <input
              type="tel"
              name="fuel-allowance"
              id="fuel-allowance"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="meal-allowance" className="text-sm font-semibold">
              Meal Allowance (GH₵)
            </label>
            <input
              type="number"
              name="meal-allowance"
              id="meal-allowance"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
        </div>
      </section>
    </section>
  );
};
