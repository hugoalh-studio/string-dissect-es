import { assertEquals } from "STD/assert/equals";
import { StringDissector } from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("Vel ex sit est sit est tempor enim et voluptua consetetur gubergren gubergren ut."), ({ value }) => {
		return value;
	}), ["Vel", " ", "ex", " ", "sit", " ", "est", " ", "sit", " ", "est", " ", "tempor", " ", "enim", " ", "et", " ", "voluptua", " ", "consetetur", " ", "gubergren", " ", "gubergren", " ", "ut", "."]);
});
Deno.test("2", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑"), ({ value }) => {
		return value;
	}), ["🤝", "💑", "💏", "👪", "👨‍👩‍👧‍👦", "👩‍👦", "👩‍👧‍👦", "🧑‍🤝‍🧑"]);
});
Deno.test("3", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[35mThis foreground will be magenta"), ({ value }) => {
		return value;
	}), ["\u001b[35m", "This", " ", "foreground", " ", "will", " ", "be", " ", "magenta"]);
});
Deno.test("4", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[38;5;6mThis foreground will be cyan"), ({ value }) => {
		return value;
	}), ["\u001b[38;5;6m", "This", " ", "foreground", " ", "will", " ", "be", " ", "cyan"]);
});
Deno.test("5", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[38;2;255;0;0mThis foreground will be bright red"), ({ value }) => {
		return value;
	}), ["\u001b[38;2;255;0;0m", "This", " ", "foreground", " ", "will", " ", "be", " ", "bright", " ", "red"]);
});
Deno.test("6", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[43mThis background will be yellow"), ({ value }) => {
		return value;
	}), ["\u001b[43m", "This", " ", "background", " ", "will", " ", "be", " ", "yellow"]);
});
Deno.test("7", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[48;5;6mThis background will be cyan"), ({ value }) => {
		return value;
	}), ["\u001b[48;5;6m", "This", " ", "background", " ", "will", " ", "be", " ", "cyan"]);
});
Deno.test("8", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[48;2;255;0;0mThis background will be bright red"), ({ value }) => {
		return value;
	}), ["\u001b[48;2;255;0;0m", "This", " ", "background", " ", "will", " ", "be", " ", "bright", " ", "red"]);
});
Deno.test("9", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[1mBold text"), ({ value }) => {
		return value;
	}), ["\u001b[1m", "Bold", " ", "text"]);
});
Deno.test("10", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[3mItalic text"), ({ value }) => {
		return value;
	}), ["\u001b[3m", "Italic", " ", "text"]);
});
Deno.test("11", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[4mUnderlined text"), ({ value }) => {
		return value;
	}), ["\u001b[4m", "Underlined", " ", "text"]);
});
Deno.test("12", { permissions: "none" }, () => {
	assertEquals(Array.from(new StringDissector().dissectExtend("\u001b[31;46mRed foreground with a cyan background and \u001b[1mbold text at the end"), ({ value }) => {
		return value;
	}), ["\u001b[31;46m", "Red", " ", "foreground", " ", "with", " ", "a", " ", "cyan", " ", "background", " ", "and", " ", "\u001b[1m", "bold", " ", "text", " ", "at", " ", "the", " ", "end"]);
});
