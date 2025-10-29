import { motion } from "framer-motion";
import { Building2, HandCoins, Save, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Company } from "./settings/Company";
import { Payroll } from "./settings/Payroll";
import { Policy } from "./settings/Policy";

export default function Settings() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-8"
    >
      <section className="flex flex-col gap-2">
        <div className="flex gap-4 justify-between items-center">
          <h1 className="font-bold text-3xl">Settings</h1>
          <button className="sm:flex hidden bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2 text-sm">
            <Save size={16} color="#fff" />
            Save Changes
          </button>
        </div>
        <p className="text-[#65758b]">
          Configure system settings and preferences
        </p>
      </section>
      <section className="flex flex-col gap-8">
        <Tabs defaultValue="company" className="flex flex-col w-full">
          <TabsList>
            <TabsTrigger value="company" className="w-full gap-2">
              <Building2 color="#000000" size={18} />
              Company
            </TabsTrigger>
            <TabsTrigger value="payroll" className="w-full gap-2">
              <HandCoins color="#000000" size={18} />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="policy" className="w-full gap-2">
              <UserCog color="#000000" size={18} />
              HR Policies
            </TabsTrigger>
          </TabsList>
          {/* Company */}
          <TabsContent value="company">
            <Company />
          </TabsContent>

          {/* Payroll */}
          <TabsContent value="payroll">
            <Payroll />
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policy">
            <Policy />
          </TabsContent>
        </Tabs>
        <button className="sm:hidden  bg-primary px-4 py-2 rounded-md text-primary-foreground flex justify-center items-center gap-2 text-sm">
          <Save size={16} color="#fff" />
          Save Changes
        </button>
      </section>
    </motion.main>
  );
}
