import { Component } from "react";
import { Headline } from "../components/Headline";
import { NotFoundSVG } from "../components/NotFoundSVG";

class NotFound extends Component {
  render() {
    return (
      <div className="flex flex-col items-center">
        <Headline level={1}>Whoopsie! That page could not be found.</Headline>
        <NotFoundSVG />
      </div>
    );
  }
}
export default NotFound;
