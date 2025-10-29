export const Company = () => {
  return (
    <section className="bg-card border rounded-lg p-6 flex flex-col gap-6">
      <h3 className="text-2xl font-semibold">Company Information</h3>
      <div className="grid flex-col gap-4 grid-cols-1">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:gap-4 md:gap-3 lg:gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="company-name" className="text-sm font-semibold">
              Company Name
            </label>
            <input
              type="text"
              name="company-name"
              id="company-name"
              autoComplete="on"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="on"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="company-name" className="text-sm font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              autoComplete="on"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tin" className="text-sm font-semibold">
              TIN Number
            </label>
            <input
              type="number"
              name="tin"
              id="tin"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="text-sm font-semibold">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            autoComplete="on"
            className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
          />
        </div>
      </div>
    </section>
  );
};
