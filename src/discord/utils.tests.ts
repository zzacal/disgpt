import { segmentMessage, segmentMessageAtSpaces } from ".";

describe("segmentMessage function", () => {
  it("should split the message into segments of the given limit", () => {
    expect(segmentMessage("hello world", 5)).toEqual(["hello", " worl", "d"]);
    expect(segmentMessage("this is a test", 3)).toEqual([
      "thi",
      "s i",
      "s a",
      " te",
      "st",
    ]);
    expect(segmentMessage("hello", 2)).toEqual(["he", "ll", "o"]);
    expect(segmentMessage("", 5)).toEqual([]);
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

describe("segmentMessage", () => {
  it("should handle messages shorter than the segment limit", () => {
    const message = "short";
    const segmentLimit = 10;

    const expectedSegments = ["short"];

    const actualSegments = segmentMessageAtSpaces(message, segmentLimit);

    expect(actualSegments).toEqual(expectedSegments);
  });
  it("should handle messages that are exactly the segment limit", () => {
    const message = "exactlyten";
    const segmentLimit = 10;

    const expectedSegments = ["exactlyten"];

    const actualSegments = segmentMessageAtSpaces(message, segmentLimit);

    expect(actualSegments).toEqual(expectedSegments);
  });
  it("should split the message into segments of the given limit", () => {
    const message =
      "This is a long message that needs to be split into smaller segments";
    const segmentLimit = 10;

    const expectedSegments = [
      "This is a",
      "long",
      "message",
      "that needs",
      "to be",
      "split into",
      "smaller",
      "segments",
    ];

    const actualSegments = segmentMessageAtSpaces(message, segmentLimit);

    expect(actualSegments).toEqual(expectedSegments);
  });
});
