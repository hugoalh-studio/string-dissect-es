import { assertEquals } from "STD/assert/equals";
import { StringDissector } from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("Vel ex sit est sit est tempor enim et voluptua consetetur gubergren gubergren ut."), ({ value }) => {
		return value;
	}), ["Vel", " ", "ex", " ", "sit", " ", "est", " ", "sit", " ", "est", " ", "tempor", " ", "enim", " ", "et", " ", "voluptua", " ", "consetetur", " ", "gubergren", " ", "gubergren", " ", "ut", "."]);
});
const sample2 = "🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑";
Deno.test("2 Dissector", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect(sample2), ({ value }) => {
		return value;
	}), ["🤝", "💑", "💏", "👪", "👨‍👩‍👧‍👦", "👩‍👦", "👩‍👧‍👦", "🧑‍🤝‍🧑"]);
});
Deno.test("2 Intl Segmenter", { permissions: "none" }, () => {
	assertEquals(Array.from(new Intl.Segmenter().segment(sample2), ({ segment }) => {
		return segment;
	}), ["🤝", "💑", "💏", "👪", "👨‍👩‍👧‍👦", "👩‍👦", "👩‍👧‍👦", "🧑‍🤝‍🧑"]);
});
const sample3 = "\u001b[35mThis foreground will be magenta";
Deno.test("3 Default", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect(sample3), ({ value }) => {
		return value;
	}), ["\u001b[35m", "This", " ", "foreground", " ", "will", " ", "be", " ", "magenta"]);
});
Deno.test("3 No Output ANSI", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector({
		outputANSI: false
	}).dissect(sample3), ({ value }) => {
		return value;
	}), ["This", " ", "foreground", " ", "will", " ", "be", " ", "magenta"]);
});
Deno.test("4", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[38;5;6mThis foreground will be cyan"), ({ value }) => {
		return value;
	}), ["\u001b[38;5;6m", "This", " ", "foreground", " ", "will", " ", "be", " ", "cyan"]);
});
Deno.test("5", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[38;2;255;0;0mThis foreground will be bright red"), ({ value }) => {
		return value;
	}), ["\u001b[38;2;255;0;0m", "This", " ", "foreground", " ", "will", " ", "be", " ", "bright", " ", "red"]);
});
Deno.test("6", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[43mThis background will be yellow"), ({ value }) => {
		return value;
	}), ["\u001b[43m", "This", " ", "background", " ", "will", " ", "be", " ", "yellow"]);
});
Deno.test("7", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[48;5;6mThis background will be cyan"), ({ value }) => {
		return value;
	}), ["\u001b[48;5;6m", "This", " ", "background", " ", "will", " ", "be", " ", "cyan"]);
});
Deno.test("8", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[48;2;255;0;0mThis background will be bright red"), ({ value }) => {
		return value;
	}), ["\u001b[48;2;255;0;0m", "This", " ", "background", " ", "will", " ", "be", " ", "bright", " ", "red"]);
});
Deno.test("9", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[1mBold text"), ({ value }) => {
		return value;
	}), ["\u001b[1m", "Bold", " ", "text"]);
});
Deno.test("10", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[3mItalic text"), ({ value }) => {
		return value;
	}), ["\u001b[3m", "Italic", " ", "text"]);
});
Deno.test("11", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("\u001b[4mUnderlined text"), ({ value }) => {
		return value;
	}), ["\u001b[4m", "Underlined", " ", "text"]);
});
const sample12 = "\u001b[31;46mRed foreground with a cyan background and \u001b[1mbold text at the end";
Deno.test("12 Default", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect(sample12), ({ value }) => {
		return value;
	}), ["\u001b[31;46m", "Red", " ", "foreground", " ", "with", " ", "a", " ", "cyan", " ", "background", " ", "and", " ", "\u001b[1m", "bold", " ", "text", " ", "at", " ", "the", " ", "end"]);
});
Deno.test("12 No Output ANSI", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector({
		outputANSI: false
	}).dissect(sample12), ({ value }) => {
		return value;
	}), ["Red", " ", "foreground", " ", "with", " ", "a", " ", "cyan", " ", "background", " ", "and", " ", "bold", " ", "text", " ", "at", " ", "the", " ", "end"]);
});
Deno.test("13", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissect("GitHub homepage is https://github.com."), ({ value }) => {
		return value;
	}), ["GitHub", " ", "homepage", " ", "is", " ", "https://github.com", "."]);
});
