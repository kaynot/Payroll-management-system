export const requestConfig = (params?: any, cusHeader?: any) => {
  // if (item === null) {
  //   window.location.href = "/";
  //   return;
  // }
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
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiVXNlckRhdGEiOiJ7XCJVc2VyTmFtZVwiOlwidGVzdFwiLFwiRW1haWxcIjpcInRlc3RAZ21haWwuY29tXCIsXCJGaXJzdE5hbWVcIjpcInRlc3RcIixcIlN1ck5hbWVcIjpcImFkYW1pblwiLFwiSXNBY3RpdmVcIjpmYWxzZX0iLCJuYmYiOjE3NjIxNzc2NjQsImV4cCI6MTc2MjE4MTI2NCwiaWF0IjoxNzYyMTc3NjY0LCJpc3MiOiJJbm5vcmlrUGF5cm9sbFN5c3RlbSIsImF1ZCI6Iklubm9yaWtQYXlyb2xsU3lzdGVtVXNlcnMifQ.HAUQUCkoodfQ6SMqQNGH-4VnTf7bL0GFCjOgHaXEcSk";
