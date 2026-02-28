(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [974], {
        2026: (e, t, a) => {
            "use strict";
            a.d(t, {
                default: () => m
            });
            var s = a(5155),
                r = a(7712),
                i = a(4616),
                n = a(2138),
                l = a(7168),
                o = a(8192),
                c = a(5084),
                d = a(2115);

            function m() {
                let [e, t] = (0, d.useState)(null), a = a => {
                    t(e === a ? null : a)
                };
                return (0, s.jsxs)("section", {
                    id: "faq",
                    className: "py-16 sm:py-24 bg-black/95 dark:bg-white/95 mx-2 sm:mx-4 mb-4 rounded-2xl overflow-hidden relative",
                    children: [(0, s.jsxs)("div", {
                        className: "absolute inset-0 overflow-hidden opacity-10",
                        children: [(0, s.jsx)("div", {
                            className: "absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-white/30 to-white/5 dark:from-black/30 dark:to-black/5 blur-3xl"
                        }), (0, s.jsx)("div", {
                            className: "absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-white/30 to-white/5 dark:from-black/30 dark:to-black/5 blur-3xl"
                        })]
                    }), (0, s.jsx)("div", {
                        className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"
                    }), (0, s.jsxs)("div", {
                        className: "max-w-3xl mx-auto px-4 sm:px-6 relative",
                        children: [(0, s.jsxs)("div", {
                            className: "text-center space-y-4 mb-10",
                            children: [(0, s.jsx)("h2", {
                                className: "text-3xl sm:text-4xl font-semibold tracking-tight text-white dark:text-black",
                                children: "FAQ."
                            }), (0, s.jsx)("p", {
                                className: "text-sm sm:text-base tracking-tight text-white/60 dark:text-black/60 max-w-2xl mx-auto",
                                children: "Looking for answers? It's here."
                            })]
                        }), (0, s.jsx)("div", {
                            className: "space-y-2.5",
                            children: [{
                                question: "How do the AI-powered sunglasses work?",
                                answer: "Our AI sunglasses use advanced neural processing to enhance your visual experience. They feature real-time scene analysis, adaptive brightness control, and augmented visual information overlay. The smart display seamlessly integrates information while maintaining optimal visibility and comfort."
                            }, {
                                question: "What's the battery life of the AI sunglasses?",
                                answer: "The sunglasses offer an impressive 24-hour battery life on a single charge, allowing for all-day use. This includes continuous AI processing, visual enhancement features, and smart display functionality without compromising performance."
                            }, {
                                question: "Can I customize the visual experience?",
                                answer: "Yes, our AI sunglasses offer full personalization options. You can customize visual enhancements, display preferences, and AI-powered adjustments that adapt to your specific needs and environmental conditions in real-time with 99% accuracy."
                            }, {
                                question: "What kind of visual enhancements do they provide?",
                                answer: "The sunglasses provide advanced visual enhancement features including adaptive brightness control, real-time scene analysis, and augmented visual information overlay. With a 10ms response time, they instantly adjust to changing light conditions and environmental factors."
                            }, {
                                question: "Are the AI sunglasses secure?",
                                answer: "Security is a top priority. Our AI sunglasses implement enterprise-grade encryption for all data processing and storage. Your visual preferences and personal settings are protected with advanced security protocols while maintaining privacy."
                            }, {
                                question: "Do you offer support for the AI sunglasses?",
                                answer: "Yes, we provide comprehensive support through our documentation, community forums, and dedicated customer service team. We're committed to ensuring you get the best experience from your AI-powered eyewear, with expert assistance available whenever you need it."
                            }].map((t, n) => (0, s.jsxs)(o.P.div, {
                                initial: {
                                    opacity: 0,
                                    y: 10
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: .3,
                                    delay: .05 * n
                                },
                                className: "backdrop-blur-sm border border-white/10 dark:border-black/10 bg-white/[0.03] dark:bg-black/[0.03] rounded-lg overflow-hidden shadow-sm shadow-white/5 dark:shadow-black/5 hover:border-white/15 dark:hover:border-black/15 transition-colors",
                                children: [(0, s.jsxs)("button", {
                                    onClick: () => a(n),
                                    className: "flex items-center justify-between w-full px-5 py-4 text-left",
                                    "aria-expanded": e === n,
                                    "aria-controls": "faq-answer-".concat(n),
                                    tabIndex: 0,
                                    onKeyDown: e => "Enter" === e.key && a(n),
                                    type: "button",
                                    children: [(0, s.jsx)("h3", {
                                        className: "text-base font-medium text-white dark:text-black",
                                        children: t.question
                                    }), (0, s.jsx)("div", {
                                        className: "flex-shrink-0 ml-4 flex items-center justify-center h-6 w-6 rounded-full bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 transition-colors",
                                        children: e === n ? (0, s.jsx)(r.A, {
                                            className: "h-3.5 w-3.5 text-white/80 dark:text-black/80"
                                        }) : (0, s.jsx)(i.A, {
                                            className: "h-3.5 w-3.5 text-white/80 dark:text-black/80"
                                        })
                                    })]
                                }), (0, s.jsx)(c.N, {
                                    initial: !1,
                                    children: e === n && (0, s.jsx)(o.P.div, {
                                        id: "faq-answer-".concat(n),
                                        initial: {
                                            height: 0,
                                            opacity: 0
                                        },
                                        animate: {
                                            height: "auto",
                                            opacity: 1,
                                            transition: {
                                                height: {
                                                    duration: .3,
                                                    ease: "easeInOut"
                                                },
                                                opacity: {
                                                    duration: .2,
                                                    delay: .1
                                                }
                                            }
                                        },
                                        exit: {
                                            height: 0,
                                            opacity: 0,
                                            transition: {
                                                height: {
                                                    duration: .3,
                                                    ease: "easeInOut"
                                                },
                                                opacity: {
                                                    duration: .2
                                                }
                                            }
                                        },
                                        children: (0, s.jsxs)("div", {
                                            className: "px-5 pb-4",
                                            children: [(0, s.jsx)("div", {
                                                className: "w-10 h-px border-t border-dashed border-white/10 dark:border-black/10 mb-3"
                                            }), (0, s.jsx)("p", {
                                                className: "text-white/70 dark:text-black/70 text-sm",
                                                children: t.answer
                                            })]
                                        })
                                    })
                                })]
                            }, "faq-".concat(t.question.toLowerCase().replace(/\s+/g, "-"))))
                        }), (0, s.jsxs)("div", {
                            className: "mt-12 text-center",
                            children: [(0, s.jsx)("h3", {
                                className: "text-lg font-medium text-white dark:text-black mb-4",
                                children: "Can't find what you're looking for? Email us."
                            }), (0, s.jsx)("div", {
                                className: "inline-block",
                                children: (0, s.jsxs)(l.$, {
                                    size: "sm",
                                    className: "h-9 px-5 bg-white dark:bg-black text-black dark:text-white rounded-lg border border-white/10 dark:border-black/10 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-black/90 transition-all duration-200 group",
                                    children: ["hi@kokonutui.pro", (0, s.jsx)(n.A, {
                                        className: "ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                    })]
                                })
                            })]
                        })]
                    })]
                })
            }
        },
        2104: (e, t, a) => {
            "use strict";
            a.d(t, {
                default: () => c
            });
            var s = a(5155),
                r = a(5196),
                i = a(2138),
                n = a(7168),
                l = a(8192),
                o = a(6766);

            function c() {
                let e = {
                    duration: .3,
                    ease: [.22, 1, .36, 1]
                };
                return (0, s.jsxs)("section", {
                    id: "pricing",
                    className: "py-20 sm:py-32 bg-[#0a0a0a] mx-2 sm:mx-4 mb-4 rounded-xl overflow-hidden relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.45] before:mix-blend-hard-light before:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%222.2%22%20numOctaves%3D%225%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] after:bg-repeat after:bg-[length:100px] after:opacity-[0.3] after:mix-blend-overlay after:content-['']",
                    children: [(0, s.jsx)("div", {
                        className: "absolute top-6 left-6 z-[4]",
                        children: (0, s.jsx)("span", {
                            className: "text-white/70 text-sm font-medium tracking-tigher",
                            children: "PROTOTYPE - 01"
                        })
                    }), (0, s.jsx)("div", {
                        className: "absolute inset-0 z-[2]",
                        children: (0, s.jsx)("div", {
                            className: "absolute inset-0 bg-gradient-to-br from-black/20 via-zinc-900/20 to-black/20 backdrop-blur-[0.2px]"
                        })
                    }), (0, s.jsxs)("div", {
                        className: "max-w-7xl mx-auto px-4 relative z-[3]",
                        children: [(0, s.jsxs)("div", {
                            className: "text-center space-y-6 mb-16",
                            children: [(0, s.jsxs)("h2", {
                                className: "text-4xl sm:text-5xl font-semibold tracking-tight text-white",
                                children: ["Experience the", " ", (0, s.jsx)("span", {
                                    className: "bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent",
                                    children: "future of vision"
                                })]
                            }), (0, s.jsx)("p", {
                                className: "text-base sm:text-lg tracking-tight text-white/60 max-w-2xl mx-auto",
                                children: "Transform your visual experience with our cutting-edge AI-powered eyewear. Premium quality meets unparalleled innovation."
                            })]
                        }), (0, s.jsx)("div", {
                            className: "relative max-w-5xl mx-auto",
                            children: (0, s.jsxs)("div", {
                                className: "relative min-h-[600px] md:h-[500px] rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 bg-white/[0.02]",
                                children: [(0, s.jsx)("div", {
                                    className: "absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"
                                }), (0, s.jsx)("div", {
                                    className: "absolute -inset-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/20 blur-sm"
                                }), (0, s.jsxs)("div", {
                                    className: "relative h-full grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-8",
                                    children: [(0, s.jsx)("div", {
                                        className: "relative flex items-center justify-center",
                                        children: (0, s.jsxs)("div", {
                                            className: "relative w-full aspect-[4/3] max-w-[400px]",
                                            children: [(0, s.jsx)("div", {
                                                className: "absolute -inset-4 bg-white/5 rounded-3xl blur-2xl"
                                            }), (0, s.jsx)(o.default, {
                                                src: "/neo.jpeg",
                                                alt: "AI Vision Pro",
                                                fill: !0,
                                                className: "object-cover object-[center_20%] rounded-xl relative"
                                            }), (0, s.jsx)("div", {
                                                className: "absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 mix-blend-overlay rounded-xl"
                                            }), (0, s.jsx)("div", {
                                                className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-xl"
                                            })]
                                        })
                                    }), (0, s.jsx)("div", {
                                        className: "relative flex flex-col justify-center",
                                        children: (0, s.jsxs)("div", {
                                            className: "space-y-6",
                                            children: [(0, s.jsxs)("div", {
                                                className: "relative",
                                                children: [(0, s.jsxs)("div", {
                                                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-1",
                                                    children: [(0, s.jsx)("h3", {
                                                        className: "text-xl sm:text-2xl font-semibold text-white",
                                                        children: "AI Vision Pro"
                                                    }), (0, s.jsx)("span", {
                                                        className: "px-2 py-0.5 text-[10px] font-medium text-black bg-white rounded-sm w-fit",
                                                        children: "Premium Edition"
                                                    })]
                                                }), (0, s.jsxs)("div", {
                                                    className: "mt-3 flex flex-wrap items-baseline gap-2 pb-4 border-b border-white/10",
                                                    children: [(0, s.jsxs)("div", {
                                                        className: "flex items-start",
                                                        children: [(0, s.jsx)("span", {
                                                            className: "text-sm text-white/60 mt-1",
                                                            children: "$"
                                                        }), (0, s.jsx)("span", {
                                                            className: "text-3xl sm:text-4xl font-bold text-white tracking-tight",
                                                            children: "299"
                                                        })]
                                                    }), (0, s.jsxs)("div", {
                                                        className: "flex flex-col",
                                                        children: [(0, s.jsx)("span", {
                                                            className: "text-xs text-white/60 font-medium",
                                                            children: "Limited Time Offer"
                                                        }), (0, s.jsx)("span", {
                                                            className: "text-[10px] text-white/40",
                                                            children: "One-time payment"
                                                        })]
                                                    })]
                                                })]
                                            }), (0, s.jsx)("div", {
                                                className: "grid grid-cols-1 gap-3",
                                                children: ["Advanced AI-Powered Vision Processing", "24/7 Battery Life Without Charging", "99% Visual Recognition Accuracy", "10ms Real-time Response Time", "Smart Display with Adaptive Brightness", "Voice Command Integration"].map((t, a) => (0, s.jsxs)(l.P.div, {
                                                    className: "flex items-start gap-2",
                                                    initial: {
                                                        opacity: 0,
                                                        x: -5
                                                    },
                                                    animate: {
                                                        opacity: 1,
                                                        x: 0
                                                    },
                                                    transition: {
                                                        delay: .2 + .05 * a,
                                                        ...e
                                                    },
                                                    children: [(0, s.jsx)("div", {
                                                        className: "flex-shrink-0 rounded-full mt-1",
                                                        children: (0, s.jsx)(r.A, {
                                                            className: "h-4 w-4 text-white"
                                                        })
                                                    }), (0, s.jsx)("span", {
                                                        className: "text-sm text-white/80",
                                                        children: t
                                                    })]
                                                }, t))
                                            }), (0, s.jsx)(l.P.div, {
                                                className: "relative pt-4 w-full sm:w-auto",
                                                transition: e,
                                                children: (0, s.jsx)("div", {
                                                    className: "rounded-xl p-1 border border-white/30 hover:border-white/50 transition-all duration-300 w-full sm:w-fit",
                                                    children: (0, s.jsxs)(n.$, {
                                                        size: "lg",
                                                        className: "w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 text-black tracking-tight group bg-white/95 rounded-lg hover:bg-white transition-all duration-300",
                                                        children: ["Pre-order Now", (0, s.jsx)(i.A, {
                                                            className: "ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                                                        })]
                                                    })
                                                })
                                            })]
                                        })
                                    })]
                                })]
                            })
                        }), (0, s.jsx)("div", {
                            className: "mt-8 sm:mt-12 relative",
                            children: (0, s.jsxs)("div", {
                                className: "w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 text-sm text-white/70 px-4 relative z-10",
                                children: [(0, s.jsxs)("div", {
                                    className: "max-w-[280px] text-center md:text-left",
                                    children: [(0, s.jsx)("p", {
                                        className: "font-medium text-white/90",
                                        children: "24/7 Premium Support"
                                    }), (0, s.jsx)("p", {
                                        className: "mt-1",
                                        children: "Our dedicated team is always ready to assist you with any questions or technical support"
                                    })]
                                }), (0, s.jsxs)("div", {
                                    className: "max-w-[280px] text-center",
                                    children: [(0, s.jsx)("p", {
                                        className: "font-medium text-white/90",
                                        children: "Free Training Sessions"
                                    }), (0, s.jsx)("p", {
                                        className: "mt-1",
                                        children: "Get personalized onboarding and training to maximize your AI Vision Pro experience"
                                    })]
                                }), (0, s.jsxs)("div", {
                                    className: "max-w-[280px] text-center md:text-right",
                                    children: [(0, s.jsx)("p", {
                                        className: "font-medium text-white/90",
                                        children: "Regular Updates"
                                    }), (0, s.jsx)("p", {
                                        className: "mt-1",
                                        children: "Stay ahead with continuous software updates and new feature releases"
                                    })]
                                })]
                            })
                        })]
                    })]
                })
            }
        },
        2256: (e, t, a) => {
            "use strict";
            a.d(t, {
                default: () => c
            });
            var s = a(5155),
                r = a(9137),
                i = a.n(r),
                n = a(6766),
                l = a(2138),
                o = a(7168);

            function c() {
                return (0, s.jsxs)("section", {
                    className: "jsx-e50c37a0e64bb78b min-h-[calc(100vh-5.5rem)] flex items-center justify-between py-6 sm:py-10 mx-2 sm:mx-4 mt-1 mb-4 rounded-xl relative overflow-hidden bg-[#0a0a0a] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.45] before:mix-blend-hard-light before:content-[''] after:absolute after:inset-0 after:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%222.2%22%20numOctaves%3D%225%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] after:bg-repeat after:bg-[length:100px] after:opacity-[0.3] after:mix-blend-overlay after:content-['']",
                    children: [(0, s.jsx)("div", {
                        className: "jsx-e50c37a0e64bb78b hidden md:block absolute top-6 left-6 z-[4]",
                        children: (0, s.jsx)("span", {
                            className: "jsx-e50c37a0e64bb78b text-white/70 text-sm font-medium tracking-tigher",
                            children: "PROTOTYPE - 01"
                        })
                    }), (0, s.jsx)("div", {
                        className: "jsx-e50c37a0e64bb78b absolute inset-0 z-[2]",
                        children: (0, s.jsx)("div", {
                            className: "jsx-e50c37a0e64bb78b absolute inset-0 bg-gradient-to-br from-black/20 via-zinc-900/20 to-black/20 backdrop-blur-[0.2px]"
                        })
                    }), (0, s.jsxs)("div", {
                        className: "jsx-e50c37a0e64bb78b flex flex-col lg:flex-row items-end justify-between w-full max-w-7xl mx-auto px-4 relative z-[3]",
                        children: [(0, s.jsx)("div", {
                            className: "jsx-e50c37a0e64bb78b w-full lg:w-3/5 space-y-6 text-center lg:text-left pb-8 lg:pb-12",
                            children: (0, s.jsxs)("div", {
                                className: "jsx-e50c37a0e64bb78b -mt-20",
                                children: [(0, s.jsxs)("div", {
                                    className: "jsx-e50c37a0e64bb78b space-y-3 mb-40 max-w-xl mx-auto",
                                    children: [(0, s.jsx)("p", {
                                        className: "jsx-e50c37a0e64bb78b text-right text-white text-md font-medium tracking-tighter",
                                        children: "Experience the next generation of AI-powered eyewear"
                                    }), (0, s.jsx)("p", {
                                        className: "jsx-e50c37a0e64bb78b text-left text-white/60 text-md tracking-tighter",
                                        children: "Seamlessly blending cutting-edge technology with sophisticated style for your everyday life. Experience the future of AI-powered eyewear that brings together the best of AI agents in one place. With all models, all tools, and all integrations, we're revolutionizing how you interact with artificial intelligence."
                                    })]
                                }), (0, s.jsxs)("h1", {
                                    className: "jsx-e50c37a0e64bb78b text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tighter",
                                    children: [(0, s.jsxs)("div", {
                                        className: "jsx-e50c37a0e64bb78b text-white",
                                        children: ["Future of", " ", (0, s.jsx)("span", {
                                            className: "jsx-e50c37a0e64bb78b bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent",
                                            children: "AI"
                                        }), " ", "Sunglass"]
                                    }), (0, s.jsx)("div", {
                                        className: "jsx-e50c37a0e64bb78b text-white/60",
                                        children: "AI close to you."
                                    })]
                                }), (0, s.jsx)("div", {
                                    className: "jsx-e50c37a0e64bb78b flex items-center justify-center lg:justify-start gap-4 pt-6",
                                    children: (0, s.jsx)("div", {
                                        className: "jsx-e50c37a0e64bb78b rounded-xl p-1 border border-white/30 hover:border-white/50 transition-all duration-300",
                                        children: (0, s.jsxs)(o.$, {
                                            size: "lg",
                                            className: "h-10 sm:h-11 px-5 sm:px-6 text-black tracking-tight group bg-white/95 rounded-lg hover:bg-white transition-all duration-300",
                                            children: ["GET STARTED", (0, s.jsx)(l.A, {
                                                className: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                            })]
                                        })
                                    })
                                })]
                            })
                        }), (0, s.jsxs)("div", {
                            className: "jsx-e50c37a0e64bb78b w-full lg:w-2/5 mt-8 lg:mt-0",
                            children: [(0, s.jsxs)("div", {
                                className: "jsx-e50c37a0e64bb78b relative w-full aspect-[4/6] max-w-[480px] mx-auto opacity-85",
                                children: [(0, s.jsx)("div", {
                                    className: "jsx-e50c37a0e64bb78b absolute -inset-4"
                                }), (0, s.jsx)("div", {
                                    className: "jsx-e50c37a0e64bb78b absolute inset-0 z-20 mix-blend-overlay opacity-90 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')]"
                                }), (0, s.jsx)("div", {
                                    className: "jsx-e50c37a0e64bb78b absolute inset-0 z-20 mix-blend-hard-light opacity-70 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%222.2%22%20numOctaves%3D%225%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')]"
                                }), (0, s.jsx)("div", {
                                    className: "jsx-e50c37a0e64bb78b absolute inset-0 z-20 mix-blend-multiply opacity-40 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%224%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')]"
                                }), (0, s.jsx)("div", {
                                    className: "jsx-e50c37a0e64bb78b absolute inset-0 z-20 bg-gradient-to-tr from-black/40 via-zinc-800/30 to-black/40 mix-blend-hard-light"
                                }), (0, s.jsx)(n.default, {
                                    src: "/neo.jpeg",
                                    alt: "AI Robot",
                                    fill: !0,
                                    className: "object-cover relative z-10 saturate-[1.2] contrast-[1.15] brightness-110",
                                    priority: !0
                                })]
                            }), (0, s.jsxs)("div", {
                                className: "jsx-e50c37a0e64bb78b mt-6 flex justify-between items-start text-sm text-white/70 px-4 relative z-10",
                                children: [(0, s.jsxs)("div", {
                                    className: "jsx-e50c37a0e64bb78b max-w-[160px]",
                                    children: [(0, s.jsx)("p", {
                                        className: "jsx-e50c37a0e64bb78b font-medium text-white/90",
                                        children: "AI-Powered Vision"
                                    }), (0, s.jsx)("p", {
                                        className: "jsx-e50c37a0e64bb78b mt-1",
                                        children: "Advanced neural processing for enhanced visual experience"
                                    })]
                                }), (0, s.jsxs)("div", {
                                    className: "jsx-e50c37a0e64bb78b max-w-[160px] text-right",
                                    children: [(0, s.jsx)("p", {
                                        className: "jsx-e50c37a0e64bb78b font-medium text-white/90",
                                        children: "Smart Display"
                                    }), (0, s.jsx)("p", {
                                        className: "jsx-e50c37a0e64bb78b mt-1",
                                        children: "Seamless information overlay with adaptive brightness"
                                    })]
                                })]
                            })]
                        })]
                    }), (0, s.jsxs)("div", {
                        className: "jsx-e50c37a0e64bb78b absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300",
                        children: [(0, s.jsx)("span", {
                            className: "jsx-e50c37a0e64bb78b text-white/60 text-xs tracking-wider uppercase",
                            children: "Scroll"
                        }), (0, s.jsx)("div", {
                            className: "jsx-e50c37a0e64bb78b w-5 h-8 rounded-full border-2 border-white/20 flex items-start p-1",
                            children: (0, s.jsx)("div", {
                                className: "jsx-e50c37a0e64bb78b w-1 h-1.5 rounded-full bg-white/60 animate-scroll"
                            })
                        })]
                    }), (0, s.jsx)(i(), {
                        id: "e50c37a0e64bb78b",
                        children: "@-webkit-keyframes float{0%{-webkit-transform:translatey(0px);transform:translatey(0px)}50%{-webkit-transform:translatey(-10px);transform:translatey(-10px)}100%{-webkit-transform:translatey(0px);transform:translatey(0px)}}@-moz-keyframes float{0%{-moz-transform:translatey(0px);transform:translatey(0px)}50%{-moz-transform:translatey(-10px);transform:translatey(-10px)}100%{-moz-transform:translatey(0px);transform:translatey(0px)}}@-o-keyframes float{0%{-o-transform:translatey(0px);transform:translatey(0px)}50%{-o-transform:translatey(-10px);transform:translatey(-10px)}100%{-o-transform:translatey(0px);transform:translatey(0px)}}@keyframes float{0%{-webkit-transform:translatey(0px);-moz-transform:translatey(0px);-o-transform:translatey(0px);transform:translatey(0px)}50%{-webkit-transform:translatey(-10px);-moz-transform:translatey(-10px);-o-transform:translatey(-10px);transform:translatey(-10px)}100%{-webkit-transform:translatey(0px);-moz-transform:translatey(0px);-o-transform:translatey(0px);transform:translatey(0px)}}.animate-float{-webkit-animation:float 6s ease-in-out infinite;-moz-animation:float 6s ease-in-out infinite;-o-animation:float 6s ease-in-out infinite;animation:float 6s ease-in-out infinite}@-webkit-keyframes scroll{0%{-webkit-transform:translatey(0);transform:translatey(0)}50%{-webkit-transform:translatey(20px);transform:translatey(20px)}100%{-webkit-transform:translatey(0);transform:translatey(0)}}@-moz-keyframes scroll{0%{-moz-transform:translatey(0);transform:translatey(0)}50%{-moz-transform:translatey(20px);transform:translatey(20px)}100%{-moz-transform:translatey(0);transform:translatey(0)}}@-o-keyframes scroll{0%{-o-transform:translatey(0);transform:translatey(0)}50%{-o-transform:translatey(20px);transform:translatey(20px)}100%{-o-transform:translatey(0);transform:translatey(0)}}@keyframes scroll{0%{-webkit-transform:translatey(0);-moz-transform:translatey(0);-o-transform:translatey(0);transform:translatey(0)}50%{-webkit-transform:translatey(20px);-moz-transform:translatey(20px);-o-transform:translatey(20px);transform:translatey(20px)}100%{-webkit-transform:translatey(0);-moz-transform:translatey(0);-o-transform:translatey(0);transform:translatey(0)}}.animate-scroll{-webkit-animation:scroll 2s ease-in-out infinite;-moz-animation:scroll 2s ease-in-out infinite;-o-animation:scroll 2s ease-in-out infinite;animation:scroll 2s ease-in-out infinite}"
                    })]
                })
            }
        },
        3104: (e, t, a) => {
            Promise.resolve().then(a.bind(a, 2026)), Promise.resolve().then(a.bind(a, 7746)), Promise.resolve().then(a.bind(a, 7288)), Promise.resolve().then(a.bind(a, 2256)), Promise.resolve().then(a.bind(a, 2104)), Promise.resolve().then(a.bind(a, 7152)), Promise.resolve().then(a.t.bind(a, 3063, 23)), Promise.resolve().then(a.t.bind(a, 3234, 23))
        },
        3999: (e, t, a) => {
            "use strict";
            a.d(t, {
                cn: () => i
            });
            var s = a(2596),
                r = a(9688);

            function i() {
                for (var e = arguments.length, t = Array(e), a = 0; a < e; a++) t[a] = arguments[a];
                return (0, r.QP)((0, s.$)(t))
            }
        },
        7152: (e, t, a) => {
            "use strict";
            a.d(t, {
                default: () => l
            });
            var s = a(5155),
                r = a(9588),
                i = a(2115),
                n = a(3999);

            function l() {
                let [e, t] = (0, i.useState)(!1), [a, l] = (0, i.useState)(0), [o, c] = (0, i.useState)(!1), [d, m] = (0, i.useState)(!0);
                return (0, i.useEffect)(() => {
                    c(!0)
                }, []), (0, i.useEffect)(() => {
                    let t;
                    return e ? t = setInterval(() => {
                        l(e => e + 1)
                    }, 1e3) : l(0), () => clearInterval(t)
                }, [e]), (0, i.useEffect)(() => {
                    let e;
                    if (!d) return;
                    let a = () => {
                            t(!0), e = setTimeout(() => {
                                t(!1), e = setTimeout(a, 1e3)
                            }, 3e3)
                        },
                        s = setTimeout(a, 100);
                    return () => {
                        clearTimeout(e), clearTimeout(s)
                    }
                }, [d]), (0, s.jsx)("div", {
                    className: "w-full py-4",
                    children: (0, s.jsxs)("div", {
                        className: "relative max-w-xl w-full mx-auto flex items-center flex-col gap-2",
                        children: [(0, s.jsx)("button", {
                            className: (0, n.cn)("group w-16 h-16 rounded-xl flex items-center justify-center transition-colors", e ? "bg-none" : "bg-none hover:bg-black/10 dark:hover:bg-white/10"),
                            type: "button",
                            onClick: () => {
                                d ? (m(!1), t(!1)) : t(e => !e)
                            },
                            children: e ? (0, s.jsx)("div", {
                                className: "w-6 h-6 rounded-sm animate-spin bg-black  dark:bg-white cursor-pointer pointer-events-auto",
                                style: {
                                    animationDuration: "3s"
                                }
                            }) : (0, s.jsx)(r.A, {
                                className: "w-6 h-6 text-black/70 dark:text-white/70"
                            })
                        }), (0, s.jsx)("span", {
                            className: (0, n.cn)("font-mono text-sm transition-opacity duration-300", e ? "text-black/70 dark:text-white/70" : "text-black/30 dark:text-white/30"),
                            children: (e => {
                                let t = Math.floor(e / 60);
                                return "".concat(t.toString().padStart(2, "0"), ":").concat((e % 60).toString().padStart(2, "0"))
                            })(a)
                        }), (0, s.jsx)("div", {
                            className: "h-4 w-64 flex items-center justify-center gap-0.5",
                            children: [...Array(48)].map((t, a) => (0, s.jsx)("div", {
                                className: (0, n.cn)("w-0.5 rounded-full transition-all duration-300", e ? "bg-black/50 dark:bg-white/50 animate-pulse" : "bg-black/10 dark:bg-white/10 h-1"),
                                style: e && o ? {
                                    height: "".concat(20 + 80 * Math.random(), "%"),
                                    animationDelay: "".concat(.05 * a, "s")
                                } : void 0
                            }, a))
                        }), (0, s.jsx)("p", {
                            className: "h-4 text-xs text-black/70 dark:text-white/70",
                            children: e ? "Listening..." : "Click to speak"
                        })]
                    })
                })
            }
        },
        7168: (e, t, a) => {
            "use strict";
            a.d(t, {
                $: () => c
            });
            var s = a(5155),
                r = a(2115),
                i = a(4624),
                n = a(2085),
                l = a(3999);
            let o = (0, n.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
                    variants: {
                        variant: {
                            default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                            destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
                            outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                            ghost: "hover:bg-accent hover:text-accent-foreground",
                            link: "text-primary underline-offset-4 hover:underline"
                        },
                        size: {
                            default: "h-9 px-4 py-2",
                            sm: "h-8 rounded-md px-3 text-xs",
                            lg: "h-10 rounded-md px-8",
                            icon: "h-9 w-9"
                        }
                    },
                    defaultVariants: {
                        variant: "default",
                        size: "default"
                    }
                }),
                c = r.forwardRef((e, t) => {
                    let {
                        className: a,
                        variant: r,
                        size: n,
                        asChild: c = !1,
                        ...d
                    } = e, m = c ? i.DX : "button";
                    return (0, s.jsx)(m, {
                        className: (0, l.cn)(o({
                            variant: r,
                            size: n,
                            className: a
                        })),
                        ref: t,
                        ...d
                    })
                });
            c.displayName = "Button"
        },
        7288: (e, t, a) => {
            "use strict";
            a.d(t, {
                Header: () => h
            });
            var s = a(5155),
                r = a(6874),
                i = a.n(r),
                n = a(7168),
                l = a(2115),
                o = a(2098),
                c = a(3509),
                d = a(4416),
                m = a(4783),
                x = a(1362);

            function h() {
                let [e, t] = (0, l.useState)(!1), [a, r] = (0, l.useState)(!1), {
                    theme: h,
                    setTheme: b
                } = (0, x.D)();
                (0, l.useEffect)(() => {
                    let e = () => {
                        t(window.scrollY > 10)
                    };
                    return window.addEventListener("scroll", e), () => window.removeEventListener("scroll", e)
                }, []);
                let u = () => {
                    b("dark" === h ? "light" : "dark")
                };
                return (0, s.jsx)("div", {
                    className: "fixed top-0 left-0 right-0 z-50",
                    children: (0, s.jsx)("header", {
                        className: "w-full  transition-all duration-300 tracking-tight ".concat("bg-white dark:bg-black shadow-sm"),
                        children: (0, s.jsxs)("div", {
                            className: "px-6",
                            children: [(0, s.jsxs)("div", {
                                className: "flex items-center justify-between h-14",
                                children: [(0, s.jsxs)("div", {
                                    className: "flex items-center gap-6",
                                    children: [(0, s.jsx)(i(), {
                                        href: "/",
                                        className: "text-lg font-bold text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors",
                                        "aria-label": "MarketPro Home",
                                        children: "❃ GLASSES."
                                    }), (0, s.jsx)("span", {
                                        children: "/"
                                    }), (0, s.jsx)("nav", {
                                        className: "hidden md:flex items-center gap-6 uppercase",
                                        children: ["Products;", "FEATURES;", "FAQ;", "PRICING;"].map(e => (0, s.jsx)(i(), {
                                            href: "#".concat(e.toLowerCase().replace(";", "")),
                                            className: "text-sm font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors",
                                            "aria-label": e,
                                            children: e
                                        }, e))
                                    })]
                                }), (0, s.jsxs)("div", {
                                    className: "hidden md:flex items-center gap-3",
                                    children: [(0, s.jsx)(n.$, {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: u,
                                        "aria-label": "Toggle theme",
                                        className: "text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors hover:bg-black/15 dark:hover:bg-white/15 rounded-lg",
                                        children: "dark" === h ? (0, s.jsx)(o.A, {
                                            className: "h-5 w-5"
                                        }) : (0, s.jsx)(c.A, {
                                            className: "h-5 w-5"
                                        })
                                    }), (0, s.jsx)(n.$, {
                                        variant: "ghost",
                                        size: "lg",
                                        className: "h-8 sm:h-10 px-5 sm:px-6 text-black dark:text-white transition-colors hover:bg-black/15 dark:hover:bg-white/15 rounded-lg",
                                        children: "Login"
                                    }), (0, s.jsx)(n.$, {
                                        size: "lg",
                                        className: "h-7 sm:h-9 px-3 sm:px-4 text-white dark:text-black tracking-tight group dark:bg-white/95 bg-black rounded-lg dark:hover:bg-white dark:hover:text-black transition-all duration-300",
                                        children: "Get Started"
                                    })]
                                }), (0, s.jsxs)("div", {
                                    className: "flex md:hidden items-center gap-2",
                                    children: [(0, s.jsx)(n.$, {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: u,
                                        "aria-label": "Toggle theme",
                                        className: "text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors",
                                        children: "dark" === h ? (0, s.jsx)(o.A, {
                                            className: "h-5 w-5"
                                        }) : (0, s.jsx)(c.A, {
                                            className: "h-5 w-5"
                                        })
                                    }), (0, s.jsx)("button", {
                                        type: "button",
                                        className: "p-2 text-black dark:text-white hover:bg-gray-800 dark:hover:bg-gray-100 rounded-md transition-colors",
                                        onClick: () => {
                                            r(!a)
                                        },
                                        "aria-label": "Toggle mobile menu",
                                        "aria-expanded": a,
                                        children: a ? (0, s.jsx)(d.A, {
                                            className: "h-5 w-5"
                                        }) : (0, s.jsx)(m.A, {
                                            className: "h-5 w-5"
                                        })
                                    })]
                                })]
                            }), a && (0, s.jsx)("div", {
                                className: "md:hidden py-4 border-t border-black/5 dark:border-white/5",
                                children: (0, s.jsxs)("nav", {
                                    className: "flex flex-col gap-3",
                                    children: [
                                        ["PRODUCTS;", "FEATURES;", "FAQ;", "PRICING;"].map(e => (0, s.jsx)(i(), {
                                            href: "#".concat(e.toLowerCase().replace(";", "")),
                                            className: "text-sm font-medium text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100",
                                            onClick: () => r(!1),
                                            children: e
                                        }, e)), (0, s.jsxs)("div", {
                                            className: "flex gap-2 mt-2 px-2",
                                            children: [(0, s.jsx)(n.$, {
                                                variant: "ghost",
                                                size: "sm",
                                                className: "flex-1 text-black dark:text-white hover:text-orange-400 dark:hover:text-orange-600 transition-colors",
                                                children: "Login"
                                            }), (0, s.jsx)(n.$, {
                                                size: "sm",
                                                className: "flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
                                                children: "Start Free"
                                            })]
                                        })
                                    ]
                                })
                            })]
                        })
                    })
                })
            }
        },
        7746: (e, t, a) => {
            "use strict";
            a.d(t, {
                Footer: () => c
            });
            var s = a(5155),
                r = a(6874),
                i = a.n(r),
                n = a(2138),
                l = a(7168);
            let o = [{
                title: "Product",
                links: [{
                    name: "Features",
                    href: "#features"
                }, {
                    name: "Pricing",
                    href: "#pricing"
                }, {
                    name: "Integrations",
                    href: "#integrations"
                }, {
                    name: "API",
                    href: "/api"
                }]
            }, {
                title: "Company",
                links: [{
                    name: "About",
                    href: "/about"
                }, {
                    name: "Careers",
                    href: "/careers"
                }, {
                    name: "Contact",
                    href: "/contact"
                }, {
                    name: "Privacy",
                    href: "/privacy"
                }]
            }];

            function c() {
                let e = new Date().getFullYear();
                return (0, s.jsx)("footer", {
                    className: "sticky bottom-0 w-full mt-auto bg-white dark:bg-black border-t border-black/5 dark:border-white/5 backdrop-blur-md z-10",
                    children: (0, s.jsxs)("div", {
                        className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8",
                        children: [(0, s.jsxs)("div", {
                            className: "flex flex-col md:flex-row md:items-center justify-between gap-8",
                            children: [(0, s.jsxs)("div", {
                                className: "flex-shrink-0 max-w-xs",
                                children: [(0, s.jsx)(i(), {
                                    href: "/",
                                    className: "text-4xl font-bold tracking-tighter text-black dark:text-white hover:opacity-90 transition-opacity",
                                    children: "❃ GLASSES."
                                }), (0, s.jsx)("p", {
                                    className: "mt-2 text-sm text-black/60 dark:text-white/60",
                                    children: "The future of powered glasses."
                                })]
                            }), (0, s.jsx)("div", {
                                className: "grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16",
                                children: o.map(e => (0, s.jsxs)("div", {
                                    className: "space-y-3",
                                    children: [(0, s.jsx)("h3", {
                                        className: "text-sm font-medium text-black dark:text-white",
                                        children: e.title
                                    }), (0, s.jsx)("ul", {
                                        className: "space-y-2",
                                        children: e.links.map(e => (0, s.jsx)("li", {
                                            children: (0, s.jsx)(i(), {
                                                href: e.href,
                                                className: "text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors",
                                                children: e.name
                                            })
                                        }, e.name))
                                    })]
                                }, e.title))
                            }), (0, s.jsxs)("div", {
                                className: "flex-shrink-0 space-y-3 max-w-xs",
                                children: [(0, s.jsx)("h3", {
                                    className: "text-sm font-medium text-black dark:text-white",
                                    children: "Stay updated"
                                }), (0, s.jsx)("p", {
                                    className: "text-sm text-black/60 dark:text-white/60",
                                    children: "Subscribe to our newsletter for the latest updates and features."
                                }), (0, s.jsxs)("div", {
                                    className: "mt-3 flex items-center gap-2",
                                    children: [(0, s.jsx)("input", {
                                        type: "email",
                                        placeholder: "Enter your email",
                                        className: "flex-1 px-3 py-2 text-sm rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                                    }), (0, s.jsx)(l.$, {
                                        size: "sm",
                                        className: "h-9 px-3 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-lg",
                                        children: (0, s.jsx)(n.A, {
                                            className: "h-4 w-4"
                                        })
                                    })]
                                })]
                            })]
                        }), (0, s.jsxs)("div", {
                            className: "flex flex-col sm:flex-row sm:items-center justify-between mt-8 pt-5 border-t border-black/5 dark:border-white/5 text-xs text-black/50 dark:text-white/50",
                            children: [(0, s.jsxs)("p", {
                                children: ["\xa9 ", e, " KOKONUT. All rights reserved."]
                            }), (0, s.jsxs)("div", {
                                className: "flex gap-4 mt-2 sm:mt-0",
                                children: [(0, s.jsx)(i(), {
                                    href: "https://kokonutui.pro/",
                                    className: "hover:text-black dark:hover:text-white transition-colors",
                                    children: "Terms"
                                }), (0, s.jsx)(i(), {
                                    href: "https://kokonutui.pro/",
                                    className: "hover:text-black dark:hover:text-white transition-colors",
                                    children: "Privacy"
                                }), (0, s.jsx)(i(), {
                                    href: "https://kokonutui.pro/",
                                    className: "hover:text-black dark:hover:text-white transition-colors",
                                    children: "Cookies"
                                })]
                            })]
                        })]
                    })
                })
            }
        }
    },
    e => {
        var t = t => e(e.s = t);
        e.O(0, [295, 874, 78, 441, 684, 358], () => t(3104)), _N_E = e.O()
    }
]);