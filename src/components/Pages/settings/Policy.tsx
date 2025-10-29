export const Policy = () => {
  return (
    <section className="flex flex-col gap-4">
      <section className="bg-card border rounded-lg p-6 flex flex-col gap-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Leave Policies</h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-4 md:gap-3 lg:gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="annual-leave" className="text-sm font-semibold">
              Annual Leave (days)
            </label>
            <input
              type="number"
              name="annual-leave"
              id="annual-leave"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="sick-leave" className="text-sm font-semibold">
              Sick Leave (days)
            </label>
            <input
              type="number"
              name="sick-leave"
              id="sick-leave"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maternal-leave" className="text-sm font-semibold">
              Maternity Leave (days)
            </label>
            <input
              type="number"
              name="maternal-leave"
              id="maternal-leave"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="paternal-leave" className="text-sm font-semibold">
              Paternity Leave (days)
            </label>
            <input
              type="number"
              name="paternal-leave"
              id="paternal-leave"
              autoComplete="off"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
        </div>
      </section>
      <section className="bg-card border rounded-lg p-6 flex flex-col gap-6 shadow-sm">
        <h3 className="text-2xl font-semibold">Working Hours</h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-3 lg:gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="start-time" className="text-sm font-semibold">
              Work Start Time
            </label>
            <input
              type="time"
              name="start-time"
              id="start-time"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="end-time" className="text-sm font-semibold">
              Work End Time
            </label>
            <input
              type="time"
              name="end-time"
              id="end-time"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="late-threshold" className="text-sm font-semibold">
              Late Threshold
            </label>
            <input
              type="time"
              name="late-threshold"
              id="late-threshold"
              className="bg-muted rounded-md py-[6px] px-3 outline-offset-4 outline-primary focus:bg-primary-foreground border"
            />
          </div>
        </div>
      </section>
    </section>
  );
};
