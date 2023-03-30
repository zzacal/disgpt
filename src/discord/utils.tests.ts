import { segmentMessage } from ".";

describe("segmentMessage function", () => {
  it('should split the message into segments of the given limit', () => {
    expect(segmentMessage('hello world', 5)).toEqual(['hello', ' worl', 'd']);
    expect(segmentMessage('this is a test', 3)).toEqual(['thi', 's i', 's a', ' te', 'st']);
    expect(segmentMessage('hello', 2)).toEqual(['he', 'll', 'o']);
    expect(segmentMessage('', 5)).toEqual([]);
  });


  it("should return an empty array if the message is empty", () => {
    const message = "";
    const segmentLimit = 5;

    expect(segmentMessage(message, segmentLimit)).toEqual([]);
  });

  it("should return the whole message if the limit is greater than the message length", () => {
    const message = "This is a short message";
    const segmentLimit = message.length;

    expect(segmentMessage(message, segmentLimit)).toEqual([message]);
  });
});
