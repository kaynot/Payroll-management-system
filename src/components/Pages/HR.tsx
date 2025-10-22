import React from "react";
import { motion } from "framer-motion";
import { BadgeCent, Plus, TrendingUp, UserCheck, Users } from "lucide-react";

export default function HR() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-8"
    >
      <section className="flex gap-4 justify-between items-center">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-3xl">HR Management</h1>
          <p className="text-[#65758b]">
            Manage employee records and information
          </p>
        </div>
        <div>
          <button className="bg-primary px-4 py-2 rounded-md text-primary-foreground flex items-center gap-2">
            <Plus size={16} color="#fff" strokeWidth={3} />
            Add Employee
          </button>
        </div>
      </section>

      <section className="flex flex-col w-full gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-between w-full gap-4 sm:gap-4 md:gap-6 lg:gap-6">
          <div className="border-[1px] rounded-lg p-4 flex gap-1 hover:shadow-lg transition duration-300 bg-card w-full h-full items-center">
            <div className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-[#65758b]">Total Employees</h1>
              <div className="flex flex-col">
                <h1 className="font-bold text-3xl">41</h1>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg h-12">
              <Users size={36} color="#4f46e5" />
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 flex gap-2 hover:shadow-lg transition duration-300 bg-card w-full h-full items-center">
            <div className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-[#65758b]">Full-time</h1>
              <div className="flex flex-col">
                <h1 className="font-bold text-3xl">16</h1>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg h-12">
              <Users size={36} color="#4f46e5" />
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 flex gap-2 hover:shadow-lg transition duration-300 bg-card w-full h-full items-center">
            <div className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-[#65758b]">Part-time</h1>
              <div className="flex flex-col">
                <h1 className="font-bold text-3xl">8</h1>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg h-12">
              <Users size={36} color="#4f46e5" />
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 flex gap-2 hover:shadow-lg transition duration-300 bg-card w-full h-full items-center">
            <div className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-[#65758b]">NSS</h1>
              <div className="flex flex-col">
                <h1 className="font-bold text-3xl">12</h1>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg h-12">
              <Users size={36} color="#4f46e5" />
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 flex gap-2 hover:shadow-lg transition duration-300 bg-card w-full h-full items-center">
            <div className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-[#65758b]">Interns</h1>
              <div className="flex flex-col">
                <h1 className="font-bold text-3xl">5</h1>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg h-12">
              <Users size={36} color="#4f46e5" />
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 flex gap-2 hover:shadow-lg transition duration-300 bg-card w-full h-full items-center">
            <div className="flex flex-col justify-between w-full gap-2">
              <h1 className="text-[#65758b]">Others</h1>
              <div className="flex flex-col">
                <h1 className="font-bold text-3xl">0</h1>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg h-12">
              <Users size={36} color="#4f46e5" />
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
