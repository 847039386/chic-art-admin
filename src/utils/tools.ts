import Bowser from "bowser";

export const getParseUserAgent = function (data :string) {
  let bowser = Bowser.parse(data)
  let platform_type = bowser.platform.type;
  let os = bowser.os;



}