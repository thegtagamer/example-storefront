/*
 *   Test to Verify NextJS rendering pages via SSR
 */
const axios = require("axios");
const chai = require("chai");
const cheerio = require("cheerio");

const url = "http://localhost:4000";

describe("NextJS Loading", () => {
  it("SSR Loads with an HTML Body", () => (
    axios.get(url)
      .then((res) => {
        if (res.status === 200) {
          const cheer = cheerio.load(res.data);
          chai.expect(cheer("#__next").find("div")).to.not.be.empty;
        }
        return;
      })
  ));
});
