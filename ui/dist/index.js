import { QueryClient as e, QueryClientProvider as t, useQuery as n } from "@tanstack/react-query";
import { defineApp as r, makeTranslator as i } from "@tokimo/sdk";
import { ConfigProvider as a, Select as o, Spin as s, ToastProvider as c, Tooltip as l, enUS as u, zhCN as d } from "@tokimo/ui";
import { StrictMode as f, createContext as p, createElement as m, forwardRef as h, useCallback as g, useContext as _, useMemo as v, useState as y } from "react";
import { createRoot as b } from "react-dom/client";
import { jsx as x, jsxs as S } from "react/jsx-runtime";
//#region src/i18n/index.ts
var C = {
	noUpcoming: "暂无即将到来的假期",
	today: "今天",
	tomorrow: "明天",
	inDays: "{count} 天后",
	goToToday: "回到今天",
	noLongWeekends: "暂无小长假",
	daysOff: "{count} 天小长假",
	needBridgeDay: "需补班",
	upcomingHolidays: "即将到来的假期",
	longWeekends: "小长假",
	nationwide: "全国性假日",
	national: "全国",
	weekdays: "日,一,二,三,四,五,六"
}, w = {
	noUpcoming: "No upcoming holidays",
	today: "Today",
	tomorrow: "Tomorrow",
	inDays: "in {count} days",
	goToToday: "Today",
	noLongWeekends: "No long weekends",
	daysOff: "{count}-day weekend",
	needBridgeDay: "bridge day needed",
	upcomingHolidays: "Upcoming Holidays",
	longWeekends: "Long Weekends",
	nationwide: "Nationwide holiday",
	national: "National",
	weekdays: "Sun,Mon,Tue,Wed,Thu,Fri,Sat"
}, T = p((e) => e), E = T.Provider;
function D() {
	return _(T);
}
//#endregion
//#region node_modules/.pnpm/lucide-react@1.16.0_react@19.2.6/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var O = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), k = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), A = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), j = (e) => {
	let t = A(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, M = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, N = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, P = p({}), F = () => _(P), I = h(({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = "", children: a, iconNode: o, ...s }, c) => {
	let { size: l = 24, strokeWidth: u = 2, absoluteStrokeWidth: d = !1, color: f = "currentColor", className: p = "" } = F() ?? {}, h = r ?? d ? Number(n ?? u) * 24 / Number(t ?? l) : n ?? u;
	return m("svg", {
		ref: c,
		...M,
		width: t ?? l ?? M.width,
		height: t ?? l ?? M.height,
		stroke: e ?? f,
		strokeWidth: h,
		className: O("lucide", p, i),
		...!a && !N(s) && { "aria-hidden": "true" },
		...s
	}, [...o.map(([e, t]) => m(e, t)), ...Array.isArray(a) ? a : [a]]);
}), L = (e, t) => {
	let n = h(({ className: n, ...r }, i) => m(I, {
		ref: i,
		iconNode: t,
		className: O(`lucide-${k(j(e))}`, `lucide-${e}`, n),
		...r
	}));
	return n.displayName = j(e), n;
}, ee = L("calendar-days", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M16 14h.01",
		key: "1gbofw"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M16 18h.01",
		key: "kzsmim"
	}]
]), R = L("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]), z = L("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), te = L("globe", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
		key: "13o1zl"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}]
]), B = L("party-popper", [
	["path", {
		d: "M5.8 11.3 2 22l10.7-3.79",
		key: "gwxi1d"
	}],
	["path", {
		d: "M4 3h.01",
		key: "1vcuye"
	}],
	["path", {
		d: "M22 8h.01",
		key: "1mrtc2"
	}],
	["path", {
		d: "M15 2h.01",
		key: "1cjtqr"
	}],
	["path", {
		d: "M22 20h.01",
		key: "1mrys2"
	}],
	["path", {
		d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
		key: "hbicv8"
	}],
	["path", {
		d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",
		key: "1i94pl"
	}],
	["path", {
		d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7",
		key: "1cofks"
	}],
	["path", {
		d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
		key: "4kbmks"
	}]
]), V = L("sunrise", [
	["path", {
		d: "M12 2v8",
		key: "1q4o3n"
	}],
	["path", {
		d: "m4.93 10.93 1.41 1.41",
		key: "2a7f42"
	}],
	["path", {
		d: "M2 18h2",
		key: "j10viu"
	}],
	["path", {
		d: "M20 18h2",
		key: "wocana"
	}],
	["path", {
		d: "m19.07 10.93-1.41 1.41",
		key: "15zs5n"
	}],
	["path", {
		d: "M22 22H2",
		key: "19qnx5"
	}],
	["path", {
		d: "m8 6 4-4 4 4",
		key: "ybng9g"
	}],
	["path", {
		d: "M16 18a4 4 0 0 0-8 0",
		key: "1lzouq"
	}]
]);
//#endregion
//#region src/pages/index.tsx
async function ne(e, t) {
	let n = await fetch(`/api/apps/calendar/holidays?year=${e}&country=${t}`, { credentials: "same-origin" });
	if (!n.ok) throw Error(`holidays fetch failed: ${n.status}`);
	return n.json();
}
async function re(e, t) {
	let n = await fetch(`/api/apps/calendar/long-weekends?year=${e}&country=${t}`, { credentials: "same-origin" });
	if (!n.ok) throw Error(`long-weekends fetch failed: ${n.status}`);
	return n.json();
}
async function ie(e) {
	let t = await fetch(`/api/apps/calendar/next-holidays?country=${e}`, { credentials: "same-origin" });
	if (!t.ok) throw Error(`next-holidays fetch failed: ${t.status}`);
	return t.json();
}
async function ae() {
	let e = await fetch("/api/apps/calendar/countries", { credentials: "same-origin" });
	if (!e.ok) throw Error(`countries fetch failed: ${e.status}`);
	return e.json();
}
var oe = 42;
function H(e) {
	return e < 10 ? `0${e}` : `${e}`;
}
function U(e, t) {
	return new Date(e, t, 0).getDate();
}
function se(e, t) {
	return new Date(e, t - 1, 1).getDay();
}
function ce(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function W(e, t, n) {
	let r = new Date(e, t - 1, n).getDay();
	return r === 0 || r === 6;
}
function G(e, t) {
	return `${H(e)}-${H(t)}`;
}
function K(e) {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function q(e, t) {
	return K(e).toLocaleDateString(t, {
		month: "short",
		day: "numeric",
		weekday: "short"
	});
}
function J(e) {
	let t = K(e), n = /* @__PURE__ */ new Date();
	return n.setHours(0, 0, 0, 0), t.setHours(0, 0, 0, 0), Math.ceil((t.getTime() - n.getTime()) / (1e3 * 60 * 60 * 24));
}
function le(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.date.slice(5);
		t.set(e, {
			localName: n.localName,
			name: n.name,
			global: n.global,
			types: n.types
		});
	}
	return t;
}
function ue(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let e = K(n.startDate), r = K(n.endDate);
		for (let n = new Date(e); n <= r; n.setDate(n.getDate() + 1)) t.add(`${n.getFullYear()}-${H(n.getMonth() + 1)}-${H(n.getDate())}`);
	}
	return t;
}
function Y({ onClick: e, children: t }) {
	return /* @__PURE__ */ x("button", {
		type: "button",
		className: "flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-black/8 hover:text-fg-primary dark:hover:bg-white/10",
		onClick: e,
		children: t
	});
}
function X({ day: e, isCurrentMonth: t, isToday: n, isWeekendDay: r, holiday: i, isLongWeekend: a, isSelected: o, onClick: s }) {
	return /* @__PURE__ */ S("button", {
		type: "button",
		className: `relative flex h-[72px] cursor-pointer flex-col items-center justify-start gap-0.5 rounded-xl pt-1.5 transition-all ${n ? "bg-red-500 text-white shadow-md shadow-red-500/25" : o ? "bg-black/8 dark:bg-white/10" : a && t ? "bg-amber-500/8 dark:bg-amber-400/10" : "hover:bg-black/5 dark:hover:bg-white/8"} ${t ? "" : "opacity-30"}`,
		onClick: s,
		children: [
			/* @__PURE__ */ x("span", {
				className: `text-sm font-medium leading-none ${n ? "text-white" : r && t ? "text-red-500 dark:text-red-400" : t ? "text-fg-primary" : "text-fg-muted"}`,
				children: e
			}),
			i && t && /* @__PURE__ */ x("span", {
				className: `mt-0.5 max-w-full truncate px-0.5 text-[9px] leading-tight ${n ? "text-white/80" : "text-red-500 dark:text-red-400"}`,
				children: i.localName
			}),
			a && t && !i && /* @__PURE__ */ x("div", { className: `mt-1 h-1 w-1 rounded-full ${n ? "bg-white/60" : "bg-amber-500 dark:bg-amber-400"}` })
		]
	});
}
function de({ holidays: e, isLoading: t, locale: n, onNavigate: r }) {
	let i = D();
	if (t) return /* @__PURE__ */ x("div", {
		className: "flex items-center justify-center py-8",
		children: /* @__PURE__ */ x(s, {})
	});
	let a = e?.slice(0, 8) ?? [];
	return a.length === 0 ? /* @__PURE__ */ x("p", {
		className: "py-4 text-center text-xs text-fg-muted",
		children: i("noUpcoming")
	}) : /* @__PURE__ */ x("div", {
		className: "flex flex-col gap-1",
		children: a.map((e) => {
			let t = J(e.date), a = q(e.date, n);
			return /* @__PURE__ */ S("button", {
				type: "button",
				className: "flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/8",
				onClick: () => r(e.date),
				children: [/* @__PURE__ */ x("div", {
					className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:bg-red-500/20",
					children: /* @__PURE__ */ x(B, { size: 14 })
				}), /* @__PURE__ */ S("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ x("p", {
						className: "truncate text-xs font-medium text-fg-primary",
						children: e.localName
					}), /* @__PURE__ */ S("p", {
						className: "text-[10px] text-fg-muted",
						children: [a, t >= 0 && /* @__PURE__ */ x("span", {
							className: "ml-1 text-red-500 dark:text-red-400",
							children: t === 0 ? i("today") : t === 1 ? i("tomorrow") : i("inDays", { count: t })
						})]
					})]
				})]
			}, e.date);
		})
	});
}
function fe({ weekends: e, isLoading: t, locale: n, onNavigate: r }) {
	let i = D();
	if (t) return /* @__PURE__ */ x("div", {
		className: "flex items-center justify-center py-4",
		children: /* @__PURE__ */ x(s, {})
	});
	let a = e ?? [];
	return a.length === 0 ? /* @__PURE__ */ x("p", {
		className: "py-4 text-center text-xs text-fg-muted",
		children: i("noLongWeekends")
	}) : /* @__PURE__ */ x("div", {
		className: "flex flex-col gap-1",
		children: a.map((e) => {
			let t = q(e.startDate, n), a = q(e.endDate, n);
			return /* @__PURE__ */ S("button", {
				type: "button",
				className: "flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/8",
				onClick: () => r(e.startDate),
				children: [/* @__PURE__ */ x("div", {
					className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
					children: /* @__PURE__ */ x(V, { size: 14 })
				}), /* @__PURE__ */ S("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ S("p", {
						className: "text-xs font-medium text-fg-primary",
						children: [i("daysOff", { count: e.dayCount }), e.needBridgeDay && /* @__PURE__ */ x("span", {
							className: "ml-1 text-[10px] text-amber-600 dark:text-amber-400",
							children: i("needBridgeDay")
						})]
					}), /* @__PURE__ */ S("p", {
						className: "text-[10px] text-fg-muted",
						children: [
							t,
							" — ",
							a
						]
					})]
				})]
			}, e.startDate);
		})
	});
}
function Z({ locale: e }) {
	let t = D(), r = t("weekdays").split(","), i = /* @__PURE__ */ new Date(), [a, c] = y(i.getFullYear()), [u, d] = y(i.getMonth() + 1), [f, p] = y(null), [m, h] = y("CN"), { data: _, isLoading: b } = n({
		queryKey: [
			"holidays",
			a,
			m
		],
		queryFn: () => ne(a, m),
		staleTime: 5 * 6e4
	}), { data: C, isLoading: w } = n({
		queryKey: [
			"long-weekends",
			a,
			m
		],
		queryFn: () => re(a, m),
		staleTime: 5 * 6e4
	}), { data: T, isLoading: E } = n({
		queryKey: ["next-holidays", m],
		queryFn: () => ie(m),
		staleTime: 5 * 6e4
	}), { data: O } = n({
		queryKey: ["countries"],
		queryFn: ae,
		staleTime: 60 * 6e4
	}), k = v(() => _ ? le(_) : /* @__PURE__ */ new Map(), [_]), A = v(() => C ? ue(C) : /* @__PURE__ */ new Set(), [C]), j = v(() => (O ?? []).map((e) => ({
		label: `${e.name} (${e.countryCode})`,
		value: e.countryCode
	})), [O]), M = g(() => {
		u === 1 ? (c((e) => e - 1), d(12)) : d((e) => e - 1), p(null);
	}, [u]), N = g(() => {
		u === 12 ? (c((e) => e + 1), d(1)) : d((e) => e + 1), p(null);
	}, [u]), P = g(() => {
		c(i.getFullYear()), d(i.getMonth() + 1), p(i.getDate());
	}, [i]), F = g(() => {
		c((e) => e - 1), p(null);
	}, []), I = g(() => {
		c((e) => e + 1), p(null);
	}, []), L = g((e) => {
		let t = K(e);
		c(t.getFullYear()), d(t.getMonth() + 1), p(t.getDate());
	}, []), B = U(a, u), V = se(a, u), q = u === 1 ? U(a - 1, 12) : U(a, u - 1), J = [];
	for (let e = V - 1; e >= 0; e--) J.push({
		day: q - e,
		isCurrentMonth: !1
	});
	for (let e = 1; e <= B; e++) J.push({
		day: e,
		isCurrentMonth: !0
	});
	let Z = 1;
	for (; J.length < oe;) J.push({
		day: Z++,
		isCurrentMonth: !1
	});
	let Q = f == null ? void 0 : k.get(G(u, f)), $ = a === i.getFullYear() && u === i.getMonth() + 1, pe = new Date(a, u - 1).toLocaleDateString(e, { month: "long" });
	return /* @__PURE__ */ S("div", {
		className: "flex h-full select-none",
		children: [/* @__PURE__ */ S("div", {
			className: "flex flex-1 flex-col",
			children: [
				/* @__PURE__ */ S("div", {
					className: "flex items-center justify-between border-b border-black/6 px-5 pb-3 pt-3 dark:border-transparent",
					children: [
						/* @__PURE__ */ S("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ S(Y, {
								onClick: F,
								children: [/* @__PURE__ */ x(R, { size: 14 }), /* @__PURE__ */ x(R, {
									size: 14,
									className: "-ml-2.5"
								})]
							}), /* @__PURE__ */ x(Y, {
								onClick: M,
								children: /* @__PURE__ */ x(R, { size: 16 })
							})]
						}),
						/* @__PURE__ */ S("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ S("h1", {
								className: "text-lg font-semibold text-fg-primary",
								children: [
									pe,
									" ",
									a
								]
							}), !$ && /* @__PURE__ */ x("button", {
								type: "button",
								className: "cursor-pointer rounded-md bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20 dark:text-red-400",
								onClick: P,
								children: t("goToToday")
							})]
						}),
						/* @__PURE__ */ S("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ x(Y, {
								onClick: N,
								children: /* @__PURE__ */ x(z, { size: 16 })
							}), /* @__PURE__ */ S(Y, {
								onClick: I,
								children: [/* @__PURE__ */ x(z, { size: 14 }), /* @__PURE__ */ x(z, {
									size: 14,
									className: "-ml-2.5"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ x("div", {
					className: "grid grid-cols-7 border-b border-black/4 px-3 dark:border-transparent",
					children: r.map((e, t) => /* @__PURE__ */ x("div", {
						className: `flex h-8 items-center justify-center text-xs font-medium ${t === 0 || t === 6 ? "text-red-500/70 dark:text-red-400/70" : "text-fg-muted"}`,
						children: e
					}, e))
				}),
				/* @__PURE__ */ S("div", {
					className: "relative flex-1 px-3 py-1",
					children: [b && /* @__PURE__ */ x("div", {
						className: "absolute inset-0 z-10 flex items-center justify-center",
						children: /* @__PURE__ */ x(s, {})
					}), /* @__PURE__ */ x("div", {
						className: "grid h-full grid-cols-7 grid-rows-6 gap-px",
						children: J.map((e, t) => {
							let n = e.isCurrentMonth ? `d-${e.day}` : `e-${t}`, r = e.isCurrentMonth ? k.get(G(u, e.day)) : void 0, o = `${a}-${H(u)}-${H(e.day)}`, s = A.has(o), c = e.isCurrentMonth && ce(new Date(a, u - 1, e.day), i);
							return /* @__PURE__ */ x(X, {
								day: e.day,
								isCurrentMonth: e.isCurrentMonth,
								isToday: c,
								isWeekendDay: e.isCurrentMonth && W(a, u, e.day),
								holiday: r,
								isLongWeekend: s,
								isSelected: e.isCurrentMonth && e.day === f,
								onClick: () => {
									e.isCurrentMonth && p(e.day);
								}
							}, n);
						})
					})]
				}),
				f != null && Q && /* @__PURE__ */ S("div", {
					className: "flex items-center gap-3 border-t border-black/6 px-5 py-2.5 dark:border-transparent",
					children: [
						/* @__PURE__ */ x(ee, {
							size: 16,
							className: "shrink-0 text-red-500 dark:text-red-400"
						}),
						/* @__PURE__ */ S("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ S("span", {
								className: "text-sm font-medium text-fg-primary",
								children: [
									u,
									"/",
									f,
									" — ",
									Q.localName
								]
							}), /* @__PURE__ */ x("span", {
								className: "ml-2 text-xs text-fg-muted",
								children: Q.name
							})]
						}),
						/* @__PURE__ */ S("div", {
							className: "flex gap-1",
							children: [Q.types.map((e) => /* @__PURE__ */ x("span", {
								className: "rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500 dark:text-red-400",
								children: e
							}, e)), Q.global && /* @__PURE__ */ x(l, {
								title: t("nationwide"),
								children: /* @__PURE__ */ S("span", {
									className: "flex items-center rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-500",
									children: [/* @__PURE__ */ x(te, {
										size: 10,
										className: "mr-0.5"
									}), t("national")]
								})
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ S("div", {
			className: "flex w-[240px] shrink-0 flex-col border-l border-black/6 dark:border-transparent",
			children: [
				/* @__PURE__ */ x("div", {
					className: "border-b border-black/6 px-3 py-3 dark:border-transparent",
					children: /* @__PURE__ */ x(o, {
						value: m,
						onChange: (e) => h(e),
						options: j,
						className: "w-full"
					})
				}),
				/* @__PURE__ */ S("div", {
					className: "border-b border-black/6 px-4 py-3 dark:border-transparent",
					children: [/* @__PURE__ */ x("p", {
						className: "text-[40px] font-light leading-none text-red-500 dark:text-red-400",
						children: i.getDate()
					}), /* @__PURE__ */ x("p", {
						className: "mt-1 text-xs text-fg-muted",
						children: i.toLocaleDateString(e, {
							weekday: "long",
							year: "numeric",
							month: "long"
						})
					})]
				}),
				/* @__PURE__ */ S("div", {
					className: "flex-1 overflow-y-auto",
					children: [
						/* @__PURE__ */ x("div", {
							className: "px-3 pb-1 pt-3",
							children: /* @__PURE__ */ x("h3", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-fg-muted",
								children: t("upcomingHolidays")
							})
						}),
						/* @__PURE__ */ x("div", {
							className: "px-1",
							children: /* @__PURE__ */ x(de, {
								holidays: T,
								isLoading: E,
								locale: e,
								onNavigate: L
							})
						}),
						/* @__PURE__ */ x("div", {
							className: "px-3 pb-1 pt-3",
							children: /* @__PURE__ */ S("h3", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-fg-muted",
								children: [
									t("longWeekends"),
									" ",
									a
								]
							})
						}),
						/* @__PURE__ */ x("div", {
							className: "px-1 pb-3",
							children: /* @__PURE__ */ x(fe, {
								weekends: C,
								isLoading: w,
								locale: e,
								onNavigate: L
							})
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/index.tsx
function Q(e) {
	let t = e.startsWith("zh") ? C : w;
	return (e, n) => {
		let r = t[e] ?? e;
		if (n) for (let [e, t] of Object.entries(n)) r = r.replace(`{${e}}`, String(t));
		return r;
	};
}
var $ = r({
	id: "calendar",
	manifest: {
		id: "calendar",
		appName: "Calendar",
		icon: "CalendarDays",
		image: "icon.png",
		color: "#ef4444",
		windowType: "calendar",
		defaultSize: {
			width: 900,
			height: 680
		},
		category: "app",
		fullBleed: !0
	},
	mount(n, r) {
		let o = new e({ defaultOptions: { queries: {
			retry: 1,
			staleTime: 3e4
		} } }), s = r.locale.startsWith("zh") ? d : u, l = Q(r.locale);
		i({
			"zh-CN": C,
			"en-US": w
		}, r.locale);
		let p = b(n);
		return p.render(/* @__PURE__ */ x(f, { children: /* @__PURE__ */ x(E, {
			value: l,
			children: /* @__PURE__ */ x(t, {
				client: o,
				children: /* @__PURE__ */ x(a, {
					locale: s,
					children: /* @__PURE__ */ x(c, { children: /* @__PURE__ */ x(Z, { locale: r.locale }) })
				})
			})
		}) })), () => p.unmount();
	}
});
//#endregion
export { $ as default };
