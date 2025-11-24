import { useEffect, useState } from "react";

export const requestConfig = (params?: any, cusHeader?: any) => {
  const token = localStorage.getItem("token");

  const requestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,

      ...cusHeader,
    },

    params,
  };

  return requestConfig;
};
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiVXNlckRhdGEiOiJ7XCJVc2VyTmFtZVwiOlwidGVzdFwiLFwiRW1haWxcIjpcInRlc3RAZ21haWwuY29tXCIsXCJGaXJzdE5hbWVcIjpcInRlc3RcIixcIlN1ck5hbWVcIjpcImFkYW1pblwiLFwiSXNBY3RpdmVcIjpmYWxzZX0iLCJuYmYiOjE3NjM1NzE5NTgsImV4cCI6MTc2MzU3NTU1OCwiaWF0IjoxNzYzNTcxOTU4LCJpc3MiOiJJbm5vcmlrUGF5cm9sbFN5c3RlbSIsImF1ZCI6Iklubm9yaWtQYXlyb2xsU3lzdGVtVXNlcnMifQ.8fFpQvBKUNF7FfT0tSkRCLs5Cvfl_Tox0vMuQMWn9jA";
