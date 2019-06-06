import React from "react";
import {shallow} from "enzyme";
import {createMemoryHistory} from "history";
import Welcome from "./welcome.component";


describe("Welcome Screen", () => {
  it("should call closeWelcomeScreen", () => {
    const closeWelcomeScreenSpy = jest.fn();
    const component = shallow(<Welcome
      welcomeScreenSeen={false}
      closeWelcomeScreen={closeWelcomeScreenSpy}
      history={createMemoryHistory()}
    />);
    component.find("Button").simulate("click");
    expect(closeWelcomeScreenSpy).toBeCalled();
  });
});
