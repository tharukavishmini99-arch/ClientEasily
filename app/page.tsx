"use client";

import Link from "next/link";
import { useState } from "react";

const channels = [
  {
    name: "WhatsApp",
    short: "WA",
    href: "/channels/whatsapp",
    description: "Reply, qualify and follow up with WhatsApp customers.",
    className: "whatsapp",
  },
  {
    name: "Instagram DMs",
    short: "IG",
    href: "/channels/instagram",
    description: "Turn Instagram conversations into qualified leads.",
    className: "instagram",
  },
  {
    name: "Facebook Messenger",
    short: "f",
    href: "/channels/messenger",
    description: "Keep Messenger conversations moving automatically.",
    className: "facebook",
  },
  {
    name: "Website Chat",
    short: "⌁",
    href: "/channels/web-chat",
    description: "Convert website visitors into real conversations.",
    className: "website",
  },
  {
    name: "Telegram",
    short: "➤",
    href: "/integrations",
    description: "Connect Telegram conversations to your sales workflow.",
    className: "telegram",
  },
];

const businessTypes = [
  "Salons & Beauty",
  "Restaurants",
  "Clinics",
  "Real Estate",
  "E-commerce",
  "Home Services",
  "Education",
  "Travel",
  "Fitness",
  "Professional Services",
];

const faqs = [
  {
    question: "Is ClientEasily only a chatbot?",
    answer:
      "No. ClientEasily is designed as an AI sales assistant. It can answer questions, capture leads, qualify prospects, follow up and hand conversations to your team when human help is needed.",
  },
  {
    question: "What businesses can use ClientEasily?",
    answer:
      "ClientEasily is designed for customer-facing businesses such as salons, restaurants, clinics, real estate, e-commerce, education, travel, fitness and home services.",
  },
  {
    question: "What is the setup fee?",
    answer:
      "There is a $99 one-time setup fee paid before the initial setup. This is separate from the monthly subscription.",
  },
  {
    question: "What are the monthly plans?",
    answer:
      "Starter is $79/month and Pro is $129/month.",
  },
  {
    question: "Do creators earn commission on the setup fee?",
    answer:
      "No. The $99 one-time setup fee is not commissionable. Creator commissions apply to eligible recurring subscription revenue.",
  },
  {
    question: "Can AI hand a conversation to my team?",
    answer:
      "Yes. When a customer needs human assistance or the conversation reaches a situation that should be handled by your team, the workflow can be handed over.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #070b22;
          --bg-soft: #0b102d;
          --bg-card: #10162f;
          --purple: #8b63ff;
          --purple-2: #7058ff;
          --blue: #5d83ff;
          --white: #ffffff;
          --text: #eef1ff;
          --muted: #a4abc4;
          --muted-2: #707892;
          --line: rgba(255, 255, 255, 0.09);
          --light: #f7f8fc;
          --darkText: #11162a;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background: var(--bg);
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* =========================================================
           NAVBAR
        ========================================================= */

        .siteNav {
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 76px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(7, 11, 34, 0.92);
          backdrop-filter: blur(20px);
        }

        .navInner {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0 18px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.045em;
          white-space: nowrap;
        }

        .brandMark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: white;
          font-size: 17px;
          font-weight: 900;
          background: linear-gradient(
            135deg,
            #8e64ff,
            #597eff
          );
          box-shadow:
            0 10px 30px rgba(104, 76, 232, 0.3);
        }

        .navLinks {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 31px;
          margin-left: auto;
          color: #aeb5ce;
          font-size: 14px;
          font-weight: 650;
        }

        .navLinks a {
          transition: color 0.2s ease;
        }

        .navLinks a:hover {
          color: white;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navLogin {
          min-height: 44px;
          padding: 0 17px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: rgba(255, 255, 255, 0.035);
          color: #e5e9f5;
          font-size: 14px;
          font-weight: 750;
        }

        .navStart {
          min-height: 44px;
          padding: 0 22px;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #8c63ff,
            #5b83ff
          );
          color: white;
          font-size: 14px;
          font-weight: 800;
          box-shadow:
            0 12px 32px rgba(100, 76, 230, 0.27);
        }

        .mobileButton {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.04);
          color: white;
          cursor: pointer;
        }

        .mobileMenu {
          display: none;
        }

        /* =========================================================
           COMMON
        ========================================================= */

        .section {
          padding: 105px 0;
        }

        .sectionLight {
          background: var(--light);
          color: var(--darkText);
        }

        .sectionDark {
          background: var(--bg);
        }

        .sectionDarkSoft {
          background: #0a1028;
        }

        .sectionLabel {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          border: 1px solid rgba(130, 94, 255, 0.25);
          background: rgba(130, 94, 255, 0.08);
          color: #b9a8ff;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.075em;
          text-transform: uppercase;
        }

        .sectionLabelLight {
          color: #7051d3;
          border-color: rgba(112, 81, 211, 0.18);
          background: rgba(112, 81, 211, 0.06);
        }

        .sectionHeading {
          margin: 17px 0 15px;
          font-size: clamp(37px, 4.7vw, 57px);
          line-height: 1.02;
          letter-spacing: -0.06em;
        }

        .gradientText {
          background: linear-gradient(
            100deg,
            #ffffff 0%,
            #aa8bff 55%,
            #6e91ff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .purpleText {
          color: #7453d7;
        }

        .sectionDescription {
          max-width: 660px;
          margin: 0;
          color: #858da5;
          font-size: 15px;
          line-height: 1.75;
        }

        .centerHeading {
          max-width: 730px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .centerHeading .sectionDescription {
          margin-left: auto;
          margin-right: auto;
        }

        .button {
          min-height: 48px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 800;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .buttonPrimary {
          color: white;
          background: linear-gradient(
            135deg,
            #9163ff,
            #5c82ff
          );
          box-shadow:
            0 17px 40px rgba(103, 74, 224, 0.28);
        }

        .buttonOutline {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.035);
          color: white;
        }

        .buttonDarkOutline {
          border: 1px solid #dfe2ea;
          color: #252b3d;
          background: white;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        /* =========================================================
           HERO
        ========================================================= */

        .hero {
          position: relative;
          min-height: auto !important;
          padding: 10px 0 70px !important;
          background:
            radial-gradient(
              circle at 75% 10%,
              rgba(91, 66, 196, 0.24),
              transparent 32%
            ),
            radial-gradient(
              circle at 5% 45%,
              rgba(39, 87, 193, 0.11),
              transparent 25%
            ),
            #070b22;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
        }

        .heroGlowOne {
          width: 300px;
          height: 300px;
          right: 5%;
          top: -100px;
          background: rgba(125, 84, 239, 0.13);
        }

        .heroGlowTwo {
          width: 220px;
          height: 220px;
          left: -100px;
          bottom: 0;
          background: rgba(58, 103, 240, 0.08);
        }

        .heroGrid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 0.91fr 1.09fr;
          align-items: start !important;
          gap: 58px;
          margin-top: 0 !important;
          padding-top: 0 !important;
        }

        .heroContent {
          max-width: 620px;
        }

        .heroTitle {
          margin: 22px 0 21px;
          font-size: clamp(50px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.07em;
        }

        .heroDescription {
          max-width: 590px;
          margin: 0;
          color: #adb5cc;
          font-size: 17px;
          line-height: 1.65;
        }

        .heroSubDescription {
          max-width: 560px;
          margin: 13px 0 0;
          color: #707993;
          font-size: 13px;
          line-height: 1.7;
        }

        .heroButtons {
          margin-top: 27px;
        }

        .heroTrust {
          display: flex;
          flex-wrap: wrap;
          gap: 9px 17px;
          margin-top: 20px;
          color: #727c96;
          font-size: 11px;
        }

        /* =========================================================
           DASHBOARD PREVIEW
        ========================================================= */

        .dashboardFrame {
          width: 100%;
          max-width: 620px;
          margin-left: auto;
          padding: 10px;
          border-radius: 23px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.025)
          );
          box-shadow:
            0 40px 100px rgba(0, 0, 0, 0.4),
            0 0 70px rgba(108, 77, 224, 0.12);
        }

        .dashboardWindow {
          overflow: hidden;
          border-radius: 16px;
          background: #0c1425;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .dashboardTop {
          height: 45px;
          display: grid;
          grid-template-columns: 70px 1fr 80px;
          align-items: center;
          padding: 0 13px;
          background: #f7f8fb;
          color: #68758a;
        }

        .windowDots {
          display: flex;
          gap: 6px;
        }

        .windowDots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #718096;
        }

        .dashboardAddress {
          justify-self: center;
          padding: 6px 15px;
          border-radius: 999px;
          background: #edf0f5;
          color: #8c96a5;
          font-size: 8px;
        }

        .dashboardLive {
          justify-self: end;
          color: #20a56c;
          font-size: 9px;
          font-weight: 800;
        }

        .dashboardLive i {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 4px;
          border-radius: 50%;
          background: #4fd89c;
        }

        .dashboardBody {
          padding: 19px;
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(102, 72, 211, 0.08),
              transparent 35%
            ),
            #0b1525;
        }

        .dashboardHeading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 15px;
        }

        .dashboardHeading small {
          display: block;
          margin-bottom: 4px;
          color: #69778d;
          font-size: 8px;
        }

        .dashboardHeading strong {
          color: #dfe5f1;
          font-size: 14px;
        }

        .activeBadge {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(54, 213, 145, 0.08);
          color: #5ddd9e;
          font-size: 8px;
          font-weight: 800;
        }

        .activeBadge i {
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-right: 4px;
          border-radius: 50%;
          background: #58dda0;
        }

        .statGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .statCard {
          min-height: 89px;
          position: relative;
          padding: 12px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          background: #101b2d;
        }

        .statIcon {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #f1efff;
          color: #7659d8;
          font-size: 10px;
        }

        .statChange {
          position: absolute;
          right: 9px;
          top: 11px;
          color: #55d69b;
          font-size: 8px;
        }

        .statNumber {
          display: block;
          margin-top: 8px;
          color: #edf1fa;
          font-size: 19px;
          font-weight: 800;
        }

        .statLabel {
          display: block;
          margin-top: 2px;
          color: #68778d;
          font-size: 7px;
        }

        .inbox {
          margin-top: 11px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          background: #0e1929;
        }

        .inboxTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #6c7890;
          font-size: 8px;
          font-weight: 800;
        }

        .inboxTitle span {
          color: #7e65db;
          font-weight: 700;
        }

        .conversation {
          display: grid;
          grid-template-columns: 7px 1fr auto;
          align-items: center;
          gap: 9px;
          min-height: 47px;
          padding: 8px 10px;
          margin-top: 7px;
          border-radius: 9px;
          background: #f5f7fa;
        }

        .conversationDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .conversationDot.green {
          background: #4fd79a;
        }

        .conversationDot.pink {
          background: #dc6dae;
        }

        .conversationDot.blue {
          background: #5e88ff;
        }

        .conversationName {
          display: block;
          color: #445169;
          font-size: 9px;
          font-weight: 800;
        }

        .conversationChannel {
          display: block;
          margin-top: 2px;
          color: #8993a4;
          font-size: 7px;
        }

        .conversationStatus {
          padding: 5px 7px;
          border-radius: 999px;
          background: #142036;
          color: #c3cad7;
          font-size: 7px;
        }

        .aiMessage {
          display: grid;
          grid-template-columns: 32px 1fr 7px;
          align-items: center;
          gap: 9px;
          margin-top: 10px;
          padding: 10px;
          border-radius: 11px;
          border: 1px solid rgba(137, 98, 242, 0.24);
          background: #111d31;
        }

        .aiIcon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(131, 91, 239, 0.15);
          color: #bba7ff;
        }

        .aiMessage strong {
          display: block;
          color: #d8dff0;
          font-size: 8px;
        }

        .aiMessage p {
          margin: 3px 0 0;
          color: #697991;
          font-size: 7px;
          line-height: 1.45;
        }

        .aiOnline {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #55d99d;
          box-shadow: 0 0 10px rgba(85, 217, 157, 0.8);
        }

        /* =========================================================
           PROBLEM
        ========================================================= */

        .problemGrid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 60px;
          align-items: center;
        }

        .problemTitle {
          max-width: 550px;
        }

        .problemMessages {
          display: grid;
          gap: 10px;
        }

        .problemMessage {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 17px 19px;
          border-radius: 13px;
          border: 1px solid #e1e4eb;
          background: white;
        }

        .problemMessage span:first-child {
          color: #273149;
          font-size: 13px;
          font-weight: 700;
        }

        .problemMessage span:last-child {
          color: #a0a7b5;
          font-size: 11px;
        }

        .problemArrow {
          padding: 12px 0;
          text-align: center;
          color: #8e96a8;
          font-size: 13px;
        }

        .solutionFlow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 9px;
        }

        .solutionStep {
          min-height: 100px;
          padding: 16px;
          border-radius: 12px;
          background: #0b1029;
          color: white;
        }

        .solutionStep strong {
          display: block;
          color: #b6a3ff;
          font-size: 10px;
        }

        .solutionStep span {
          display: block;
          margin-top: 10px;
          color: #f1f3fa;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.35;
        }

        /* =========================================================
           HOW IT WORKS
        ========================================================= */

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .stepCard {
          position: relative;
          min-height: 220px;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e0e4ec;
          background: white;
        }

        .stepNumber {
          color: #7857db;
          font-size: 11px;
          font-weight: 900;
        }

        .stepIcon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          margin-top: 25px;
          border-radius: 12px;
          background: #f0ecff;
          color: #7252d5;
          font-weight: 900;
        }

        .stepCard h3 {
          margin: 15px 0 7px;
          color: #161d31;
          font-size: 16px;
        }

        .stepCard p {
          margin: 0;
          color: #7b8497;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================================
           AI FEATURES
        ========================================================= */

        .featuresGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 40px;
        }

        .featureCard {
          min-height: 210px;
          padding: 25px;
          border-radius: 17px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
        }

        .featureNumber {
          color: #8e6af0;
          font-size: 10px;
          font-weight: 900;
        }

        .featureIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-top: 19px;
          border-radius: 11px;
          color: #bba8ff;
          background: rgba(132, 91, 237, 0.12);
        }

        .featureCard h3 {
          margin: 14px 0 7px;
          color: white;
          font-size: 16px;
        }

        .featureCard p {
          margin: 0;
          color: #818ca2;
          font-size: 12px;
          line-height: 1.65;
        }

        /* =========================================================
           DEMO
        ========================================================= */

        .demoGrid {
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          gap: 45px;
          align-items: center;
        }

        .phone {
          width: min(420px, 100%);
          margin: 0 auto;
          padding: 11px;
          border-radius: 27px;
          background: #10162b;
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
        }

        .phoneScreen {
          overflow: hidden;
          border-radius: 19px;
          background: #f4f6fa;
        }

        .phoneTop {
          padding: 15px;
          background: #ffffff;
          color: #182034;
          border-bottom: 1px solid #e8eaf0;
        }

        .phoneTop small {
          display: block;
          color: #8892a4;
          font-size: 8px;
        }

        .phoneTop strong {
          display: block;
          margin-top: 3px;
          font-size: 13px;
        }

        .chatArea {
          padding: 15px;
        }

        .chatBubble {
          max-width: 82%;
          padding: 11px 12px;
          margin-bottom: 9px;
          border-radius: 12px;
          font-size: 10px;
          line-height: 1.5;
        }

        .chatCustomer {
          margin-right: auto;
          background: white;
          color: #39435a;
          border: 1px solid #e5e8ee;
          border-bottom-left-radius: 4px;
        }

        .chatAI {
          margin-left: auto;
          background: #7357d8;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .leadCaptured {
          margin-top: 14px;
          padding: 14px;
          border-radius: 12px;
          background: white;
          border: 1px solid #e2e6ed;
        }

        .leadCapturedTitle {
          color: #7655d8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .leadRows {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .leadRow {
          padding: 9px;
          border-radius: 8px;
          background: #f4f5f8;
        }

        .leadRow small {
          display: block;
          color: #8c95a6;
          font-size: 7px;
        }

        .leadRow strong {
          display: block;
          margin-top: 3px;
          color: #2d374b;
          font-size: 9px;
        }

        .demoCopy {
          max-width: 550px;
        }

        .demoList {
          display: grid;
          gap: 12px;
          margin-top: 25px;
        }

        .demoListItem {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .demoListIcon {
          flex: 0 0 auto;
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(133, 91, 237, 0.13);
          color: #b9a5ff;
          font-size: 11px;
        }

        .demoListItem strong {
          display: block;
          color: white;
          font-size: 13px;
        }

        .demoListItem p {
          margin: 3px 0 0;
          color: #7d899f;
          font-size: 11px;
          line-height: 1.5;
        }

        /* =========================================================
           INTEGRATIONS
        ========================================================= */

        .integrationGrid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-top: 40px;
        }

        .integrationCard {
          min-height: 170px;
          padding: 21px;
          border-radius: 15px;
          border: 1px solid #e1e5ec;
          background: white;
          transition: 0.2s ease;
        }

        .integrationCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 45px rgba(29, 42, 65, 0.08);
        }

        .integrationIcon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 900;
        }

        .integrationIcon.whatsapp {
          color: #159e66;
          background: #e8faf2;
        }

        .integrationIcon.instagram {
          color: #c04d98;
          background: #fff0f8;
        }

        .integrationIcon.facebook {
          color: #3d72ce;
          background: #edf4ff;
        }

        .integrationIcon.website {
          color: #7354d5;
          background: #f1edff;
        }

        .integrationIcon.telegram {
          color: #2788c8;
          background: #eaf7ff;
        }

        .integrationCard h3 {
          margin: 16px 0 6px;
          color: #171e31;
          font-size: 14px;
        }

        .integrationCard p {
          margin: 0;
          color: #7c8597;
          font-size: 11px;
          line-height: 1.55;
        }

        /* =========================================================
           BUSINESS TYPES
        ========================================================= */

        .businessGrid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 9px;
          margin-top: 38px;
        }

        .businessCard {
          padding: 18px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
          transition: 0.2s ease;
        }

        .businessCard:hover {
          border-color: rgba(137, 99, 244, 0.3);
          background: rgba(132, 91, 237, 0.06);
        }

        .businessCard span {
          display: block;
          color: #7556d7;
          font-size: 9px;
          font-weight: 900;
        }

        .businessCard strong {
          display: block;
          margin-top: 11px;
          color: #edf0f8;
          font-size: 12px;
        }

        /* =========================================================
           WHY CLIENTEASILY
        ========================================================= */

        .whyGrid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 50px;
          align-items: center;
        }

        .whyItems {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .whyItem {
          padding: 18px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
        }

        .whyItem strong {
          color: #f2f4fa;
          font-size: 12px;
        }

        .whyItem p {
          margin: 6px 0 0;
          color: #7e899f;
          font-size: 10px;
          line-height: 1.55;
        }

        /* =========================================================
           PRICING
        ========================================================= */

        .pricingGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 43px;
        }

        .pricingCard {
          position: relative;
          padding: 30px;
          border-radius: 19px;
          border: 1px solid #e0e4ec;
          background: white;
        }

        .pricingCardPopular {
          border-color: #8d6cf0;
          box-shadow:
            0 20px 65px rgba(93, 70, 190, 0.13);
        }

        .popularBadge {
          position: absolute;
          top: 18px;
          right: 18px;
          padding: 6px 9px;
          border-radius: 999px;
          background: #eee8ff;
          color: #7451d5;
          font-size: 8px;
          font-weight: 900;
        }

        .pricingName {
          color: #7554d4;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .pricingCard h3 {
          margin: 12px 0 5px;
          color: #141a2d;
          font-size: 20px;
          letter-spacing: -0.03em;
        }

        .pricingCardDescription {
          min-height: 38px;
          color: #838b9c;
          font-size: 11px;
          line-height: 1.55;
        }

        .price {
          margin-top: 18px;
          color: #11172a;
          font-size: 43px;
          font-weight: 900;
          letter-spacing: -0.06em;
        }

        .price small {
          color: #7e8798;
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0;
        }

        .priceFeatures {
          display: grid;
          gap: 9px;
          padding: 0;
          margin: 23px 0;
          list-style: none;
        }

        .priceFeatures li {
          color: #5f687a;
          font-size: 11px;
        }

        .priceFeatures li::before {
          content: "✓";
          margin-right: 8px;
          color: #6f50d4;
          font-weight: 900;
        }

        .priceButton {
          width: 100%;
        }

        .comingSoon {
          display: inline-flex;
          padding: 5px 8px;
          margin-left: 6px;
          border-radius: 999px;
          background: #f0f1f5;
          color: #7d8595;
          font-size: 8px;
          vertical-align: middle;
        }

        .setupBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 13px;
          padding: 19px 22px;
          border-radius: 15px;
          border: 1px solid #e0e4ec;
          background: #fff;
        }

        .setupBox strong {
          display: block;
          color: #1c2437;
          font-size: 13px;
        }

        .setupBox span {
          display: block;
          margin-top: 4px;
          color: #858d9d;
          font-size: 10px;
        }

        .setupBoxRight {
          color: #7454d6;
          font-size: 20px;
          font-weight: 900;
          white-space: nowrap;
        }

        /* =========================================================
           CREATOR
        ========================================================= */

        .creatorGrid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 55px;
          align-items: center;
        }

        .creatorCopy p {
          max-width: 650px;
          color: #8994aa;
          font-size: 14px;
          line-height: 1.75;
        }

        .creatorHighlight {
          color: #c6b8ff !important;
          font-weight: 750;
        }

        .creatorCard {
          padding: 27px;
          border-radius: 19px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(128, 86, 239, 0.15),
              transparent 45%
            ),
            rgba(255, 255, 255, 0.025);
        }

        .creatorCardTitle {
          color: #a998ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .creatorRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 17px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .creatorRow:last-of-type {
          border-bottom: 0;
        }

        .creatorRow span {
          color: #aab2c4;
          font-size: 12px;
        }

        .creatorRow strong {
          color: #c0aeff;
          font-size: 14px;
        }

        .creatorDisclaimer {
          margin-top: 17px;
          color: #6e7890;
          font-size: 9px;
          line-height: 1.55;
        }

        /* =========================================================
           FAQ
        ========================================================= */

        .faqGrid {
          max-width: 820px;
          margin: 42px auto 0;
        }

        .faqItem {
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
        }

        .faqQuestion {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 21px 0;
          border: 0;
          background: transparent;
          color: white;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          font-weight: 750;
        }

        .faqPlus {
          color: #8d70e9;
          font-size: 20px;
        }

        .faqAnswer {
          max-width: 720px;
          padding: 0 0 21px;
          color: #828ca1;
          font-size: 12px;
          line-height: 1.7;
        }

        /* =========================================================
           FINAL CTA
        ========================================================= */

        .ctaSection {
          padding: 90px 0 105px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(117, 78, 230, 0.18),
              transparent 45%
            ),
            #070b22;
        }

        .ctaBox {
          padding: 65px 50px;
          text-align: center;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(139, 96, 244, 0.13),
              transparent 45%
            ),
            rgba(255, 255, 255, 0.025);
        }

        .ctaBox h2 {
          max-width: 800px;
          margin: 18px auto 13px;
          font-size: clamp(38px, 5vw, 61px);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .ctaBox p {
          max-width: 590px;
          margin: 0 auto;
          color: #858fa7;
          font-size: 14px;
          line-height: 1.7;
        }

        .ctaButtons {
          justify-content: center;
          margin-top: 27px;
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .footer {
          padding: 55px 0 35px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          background: #05091a;
        }

        .footerGrid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px;
        }

        .footerBrand p {
          max-width: 310px;
          margin-top: 15px;
          color: #6f7991;
          font-size: 11px;
          line-height: 1.7;
        }

        .footerColumn {
          display: grid;
          align-content: start;
          gap: 10px;
        }

        .footerColumn strong {
          margin-bottom: 5px;
          color: #d9deea;
          font-size: 11px;
        }

        .footerColumn a {
          color: #69738b;
          font-size: 10px;
        }

        .footerColumn a:hover {
          color: white;
        }

        .copyright {
          margin-top: 45px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #505a71;
          font-size: 9px;
        }

        /* =========================================================
           RESPONSIVE
        ========================================================= */

        @media (max-width: 1050px) {
          .navLinks {
            gap: 18px;
          }

          .heroGrid {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .heroContent {
            max-width: 800px;
          }

          .dashboardFrame {
            margin: 0 auto;
          }

          .problemGrid,
          .demoGrid,
          .whyGrid,
          .creatorGrid {
            grid-template-columns: 1fr;
          }

          .problemMessages {
            max-width: 800px;
            margin: 0 auto;
          }

          .demoCopy {
            max-width: 700px;
          }

          .phone {
            order: 2;
          }

          .featuresGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .integrationGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .businessGrid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 820px) {
          .navLinks,
          .navActions {
            display: none;
          }

          .mobileButton {
            display: grid;
            place-items: center;
          }

          .mobileMenu {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 69px;
            padding: 12px 17px 18px;
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 15px;
            background: #0b1029;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
          }

          .mobileMenu a {
            display: block;
            padding: 11px 0;
            color: #b6bfd2;
            font-size: 13px;
          }

          .mobileMenu .mobileCTA {
            margin-top: 8px;
            text-align: center;
          }

          .stepsGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .pricingGrid {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .businessGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footerGrid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 620px) {
          .container {
            width: min(100% - 28px, 1180px);
          }

          .section {
            padding: 75px 0;
          }

          .hero {
            padding: 55px 0 70px;
          }

          .heroTitle {
            font-size: 45px;
          }

          .heroDescription {
            font-size: 16px;
          }

          .heroSubDescription {
            display: none;
          }

          .statGrid {
            grid-template-columns: 1fr 1fr;
          }

          .dashboardBody {
            padding: 12px;
          }

          .dashboardAddress {
            display: none;
          }

          .dashboardTop {
            grid-template-columns: 60px 1fr 65px;
          }

          .solutionFlow {
            grid-template-columns: 1fr 1fr;
          }

          .featuresGrid {
            grid-template-columns: 1fr;
          }

          .stepsGrid {
            grid-template-columns: 1fr;
          }

          .integrationGrid {
            grid-template-columns: 1fr 1fr;
          }

          .businessGrid {
            grid-template-columns: 1fr 1fr;
          }

          .whyItems {
            grid-template-columns: 1fr;
          }

          .setupBox {
            align-items: flex-start;
            flex-direction: column;
          }

          .creatorGrid {
            gap: 30px;
          }

          .ctaBox {
            padding: 45px 20px;
          }

          .footerGrid {
            grid-template-columns: 1fr;
          }

          .footer {
            padding-bottom: 25px;
          }
        }

        @media (max-width: 430px) {
          .heroTitle {
            font-size: 40px;
          }

          .browserTop {
            grid-template-columns: 50px 1fr 70px;
          }

          .browserStatus {
            font-size: 7px;
          }

          .mockPill {
            display: none;
          }

          .conversation {
            grid-template-columns: 7px 1fr;
          }

          .conversationStatus {
            display: none;
          }

          .floatingAI {
            right: 10px;
            left: 10px;
            min-width: 0;
          }

          .integrationGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header className="siteNav">
        <div className="container navInner">
          <Link href="/" className="brand">
            <span className="brandMark">C</span>
            <span>ClientEasily</span>
          </Link>

          <nav className="navLinks">
            <a href="#product">Product</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#integrations">Integrations</a>
            <a href="#pricing">Pricing</a>
            <Link href="/creators">Creators</Link>
          </nav>

          <div className="navActions">
            <Link href="/auth/login" className="navLogin">
              Log in
            </Link>

            <Link href="/auth/signup" className="navStart">
              Start Free
            </Link>
          </div>

          <button
            className="mobileButton"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Open navigation"
          >
            ☰
          </button>
        </div>

        {mobileMenu && (
          <div className="mobileMenu">
            <a href="#product" onClick={() => setMobileMenu(false)}>
              Product
            </a>

            <a href="#how-it-works" onClick={() => setMobileMenu(false)}>
              How It Works
            </a>

            <a href="#integrations" onClick={() => setMobileMenu(false)}>
              Integrations
            </a>

            <a href="#pricing" onClick={() => setMobileMenu(false)}>
              Pricing
            </a>

            <Link href="/creators">Creators</Link>
            <Link href="/auth/login">Log in</Link>

            <Link
              href="/auth/signup"
              className="navStart mobileCTA"
            >
              Start Free
            </Link>
          </div>
        )}
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="hero" id="product">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="container heroGrid">
          <div className="heroContent">
            <span className="sectionLabel">
              AI SALES ASSISTANT FOR CUSTOMER-FACING BUSINESSES
            </span>

            <h1 className="heroTitle">
              Turn more customer conversations into{" "}
              <span className="gradientText">
                paying customers.
              </span>
            </h1>

            <p className="heroDescription">
              ClientEasily answers customers, captures leads and follows
              up across your customer channels — 24/7.
            </p>

            <p className="heroSubDescription">
              Train one assistant with your business knowledge and keep
              every conversation moving.
            </p>

            <div className="actions heroButtons">
              <Link
                href="/auth/signup"
                className="button buttonPrimary"
              >
                Start Free
                <span>→</span>
              </Link>

              <a
                href="#how-it-works"
                className="button buttonOutline"
              >
                See How It Works
              </a>
            </div>

            <div className="heroTrust">
              <span>✓ Business-trained AI</span>
              <span>✓ Lead capture</span>
              <span>✓ Automated follow-ups</span>
              <span>✓ Human handover</span>
            </div>
          </div>

          {/* CLEAR DASHBOARD PREVIEW */}

          <div className="dashboardFrame">
            <div className="dashboardWindow">
              <div className="dashboardTop">
                <div className="windowDots">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="dashboardAddress">
                  app.clienteasily.ai/dashboard
                </div>

                <div className="dashboardLive">
                  <i />
                  AI Active
                </div>
              </div>

              <div className="dashboardBody">
                <div className="dashboardHeading">
                  <div>
                    <small>Dashboard</small>
                    <strong>Today&apos;s overview</strong>
                  </div>

                  <div className="activeBadge">
                    <i />
                    AI Active
                  </div>
                </div>

                <div className="statGrid">
                  <DashboardStat
                    icon="◌"
                    number="24"
                    label="New Conversations"
                    change="+12%"
                  />

                  <DashboardStat
                    icon="♙"
                    number="18"
                    label="New Leads"
                    change="+8%"
                  />

                  <DashboardStat
                    icon="◉"
                    number="11"
                    label="Qualified Leads"
                    change="+5%"
                  />

                  <DashboardStat
                    icon="◷"
                    number="7"
                    label="Follow-ups"
                    change="+3"
                  />
                </div>

                <div className="inbox">
                  <div className="inboxTitle">
                    <strong>UNIFIED INBOX</strong>
                    <span>All channels</span>
                  </div>

                  <Conversation
                    name="John Smith"
                    channel="WhatsApp"
                    status="Qualified"
                    dot="green"
                  />

                  <Conversation
                    name="Sarah Johnson"
                    channel="Instagram"
                    status="New"
                    dot="pink"
                  />

                  <Conversation
                    name="Mike Davis"
                    channel="Website"
                    status="Contacted"
                    dot="blue"
                  />
                </div>

                <div className="aiMessage">
                  <div className="aiIcon">✦</div>

                  <div>
                    <strong>AI Assistant</strong>
                    <p>
                      I can help with that using your approved business
                      information.
                    </p>
                  </div>

                  <span className="aiOnline" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROBLEM
      ========================================================= */}

      <section className="section sectionLight">
        <div className="container problemGrid">
          <div className="problemTitle">
            <span className="sectionLabel sectionLabelLight">
              THE PROBLEM
            </span>

            <h2 className="sectionHeading">
              Every unanswered message can become a{" "}
              <span className="purpleText">
                lost customer.
              </span>
            </h2>

            <p className="sectionDescription">
              Customers ask questions at all hours. Your team gets busy.
              Messages get missed. Potential customers move on.
            </p>
          </div>

          <div>
            <div className="problemMessages">
              <div className="problemMessage">
                <span>&quot;How much does this cost?&quot;</span>
                <span>No response</span>
              </div>

              <div className="problemMessage">
                <span>&quot;Are you available tomorrow?&quot;</span>
                <span>Missed</span>
              </div>

              <div className="problemMessage">
                <span>&quot;Can I book?&quot;</span>
                <span>Too late</span>
              </div>
            </div>

            <div className="problemArrow">
              ↓
            </div>

            <div className="solutionFlow">
              <div className="solutionStep">
                <strong>01</strong>
                <span>Instant AI response</span>
              </div>

              <div className="solutionStep">
                <strong>02</strong>
                <span>Lead captured</span>
              </div>

              <div className="solutionStep">
                <strong>03</strong>
                <span>Lead qualified</span>
              </div>

              <div className="solutionStep">
                <strong>04</strong>
                <span>Follow-up or handover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        className="section sectionLight"
        id="how-it-works"
      >
        <div className="container">
          <div className="centerHeading">
            <span className="sectionLabel sectionLabelLight">
              HOW IT WORKS
            </span>

            <h2 className="sectionHeading">
              From message to{" "}
              <span className="purpleText">
                customer.
              </span>
            </h2>

            <p className="sectionDescription">
              Set up your business once, teach the AI how your business
              works, then let ClientEasily handle repetitive conversations.
            </p>
          </div>

          <div className="stepsGrid">
            <Step
              number="01"
              icon="✉"
              title="Customer messages"
              text="A customer starts a conversation on one of your connected channels."
            />

            <Step
              number="02"
              icon="✦"
              title="AI answers"
              text="ClientEasily responds using your approved business knowledge."
            />

            <Step
              number="03"
              icon="↗"
              title="Lead captured"
              text="Important customer details and buying intent can be organized."
            />

            <Step
              number="04"
              icon="↻"
              title="Follow up"
              text="The AI keeps the conversation moving or hands it to your team."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          AI FEATURES
      ========================================================= */}

      <section className="section sectionDark" id="features">
        <div className="container">
          <div className="sectionHeading">
            <span className="sectionLabel">
              ALL-IN-ONE SALES ASSISTANT
            </span>

            <h2 className="sectionHeading">
              More than a chatbot.
              <br />
              <span className="gradientText">
                A sales workflow.
              </span>
            </h2>

            <p className="sectionDescription">
              ClientEasily combines AI replies, lead capture,
              qualification, follow-ups and human handover in one workspace.
            </p>
          </div>

          <div className="featuresGrid">
            <Feature
              number="01"
              icon="✦"
              title="Instant AI Replies"
              text="Answer common customer questions automatically using your business knowledge."
            />

            <Feature
              number="02"
              icon="↗"
              title="Lead Capture"
              text="Collect customer names, contact details and requirements from conversations."
            />

            <Feature
              number="03"
              icon="◎"
              title="Lead Qualification"
              text="Identify buying intent and separate serious prospects from general questions."
            />

            <Feature
              number="04"
              icon="↻"
              title="Automated Follow-ups"
              text="Keep warm prospects moving without manually remembering every conversation."
            />

            <Feature
              number="05"
              icon="♧"
              title="Human Handover"
              text="Move important conversations to your team whenever human help is needed."
            />

            <Feature
              number="06"
              icon="▦"
              title="Unified Conversations"
              text="Keep customer conversations and sales opportunities organized in one system."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT DEMO
      ========================================================= */}

      <section className="section sectionDarkSoft" id="demo">
        <div className="container demoGrid">
          <div className="phone">
            <div className="phoneScreen">
              <div className="phoneTop">
                <small>ClientEasily AI</small>
                <strong>Customer conversation</strong>
              </div>

              <div className="chatArea">
                <div className="chatBubble chatCustomer">
                  Hi, are you available tomorrow?
                </div>

                <div className="chatBubble chatAI">
                  Yes! We currently have availability tomorrow. Would you
                  prefer morning or afternoon?
                </div>

                <div className="chatBubble chatCustomer">
                  Morning.
                </div>

                <div className="chatBubble chatAI">
                  Great. May I have your name and phone number so our team
                  can confirm your appointment?
                </div>

                <div className="leadCaptured">
                  <div className="leadCapturedTitle">
                    LEAD CAPTURED
                  </div>

                  <div className="leadRows">
                    <div className="leadRow">
                      <small>Name</small>
                      <strong>Customer</strong>
                    </div>

                    <div className="leadRow">
                      <small>Intent</small>
                      <strong>High</strong>
                    </div>

                    <div className="leadRow">
                      <small>Status</small>
                      <strong>Qualified</strong>
                    </div>

                    <div className="leadRow">
                      <small>Source</small>
                      <strong>Chat</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="demoCopy">
            <span className="sectionLabel">
              SEE IT IN ACTION
            </span>

            <h2 className="sectionHeading">
              Every conversation can become a{" "}
              <span className="gradientText">
                sales opportunity.
              </span>
            </h2>

            <p className="sectionDescription">
              ClientEasily does more than send an answer. It can help move
              the conversation forward, collect useful information and
              involve your team when necessary.
            </p>

            <div className="demoList">
              <DemoItem
                icon="1"
                title="Answer"
                text="Give customers useful answers using approved business information."
              />

              <DemoItem
                icon="2"
                title="Understand"
                text="Recognize useful customer details and buying intent."
              />

              <DemoItem
                icon="3"
                title="Follow up"
                text="Keep interested prospects from disappearing."
              />

              <DemoItem
                icon="4"
                title="Handover"
                text="Let your team take over when human assistance matters."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTEGRATIONS
      ========================================================= */}

      <section
        className="section sectionLight"
        id="integrations"
      >
        <div className="container">
          <div className="centerHeading">
            <span className="sectionLabel sectionLabelLight">
              INTEGRATIONS
            </span>

            <h2 className="sectionHeading">
              Your customers are everywhere.
              <br />
              <span className="purpleText">
                ClientEasily is ready there too.
              </span>
            </h2>

            <p className="sectionDescription">
              Connect the customer channels your business uses and manage
              conversations through one sales workflow.
            </p>
          </div>

          <div className="integrationGrid">
            {channels.map((channel) => (
              <Link
                href={channel.href}
                className="integrationCard"
                key={channel.name}
              >
                <div
                  className={`integrationIcon ${channel.className}`}
                >
                  {channel.short}
                </div>

                <h3>{channel.name}</h3>

                <p>{channel.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          BUSINESS TYPES
      ========================================================= */}

      <section className="section sectionDark">
        <div className="container">
          <div className="centerHeading">
            <span className="sectionLabel">
              BUILT FOR CUSTOMER-FACING BUSINESSES
            </span>

            <h2 className="sectionHeading">
              One AI assistant.
              <br />
              <span className="gradientText">
                Many businesses.
              </span>
            </h2>

            <p className="sectionDescription">
              ClientEasily uses one reusable sales workflow that can adapt
              to the way your business sells and serves customers.
            </p>
          </div>

          <div className="businessGrid">
            {businessTypes.map((business, index) => (
              <div className="businessCard" key={business}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{business}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY CLIENTEASILY
      ========================================================= */}

      <section className="section sectionDarkSoft">
        <div className="container whyGrid">
          <div>
            <span className="sectionLabel">
              WHY CLIENTEASILY
            </span>

            <h2 className="sectionHeading">
              Built to help your team{" "}
              <span className="gradientText">
                sell better.
              </span>
            </h2>

            <p className="sectionDescription">
              The goal is not simply to add another chatbot. ClientEasily
              brings the repetitive parts of customer conversations into
              one organized workflow.
            </p>
          </div>

          <div className="whyItems">
            <WhyItem
              title="Business Knowledge"
              text="Teach the assistant how your business works."
            />

            <WhyItem
              title="Conversation History"
              text="Keep customer conversations organized."
            />

            <WhyItem
              title="Lead Capture"
              text="Turn conversations into useful customer records."
            />

            <WhyItem
              title="Lead Qualification"
              text="Identify conversations with buying intent."
            />

            <WhyItem
              title="Follow-ups"
              text="Keep warm prospects moving."
            />

            <WhyItem
              title="Human Handover"
              text="Bring your team in when needed."
            />

            <WhyItem
              title="Customer Database"
              text="Keep customer information in one workspace."
            />

            <WhyItem
              title="Multi-channel"
              text="Work across the channels your customers use."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          PRICING
      ========================================================= */}

      <section
        className="section sectionLight"
        id="pricing"
      >
        <div className="container">
          <div className="centerHeading">
            <span className="sectionLabel sectionLabelLight">
              PRICING
            </span>

            <h2 className="sectionHeading">
              Simple plans.
              <br />
              <span className="purpleText">
                Clear pricing.
              </span>
            </h2>

            <p className="sectionDescription">
              A $99 one-time setup fee is paid before setup. Then choose
              the monthly plan that fits your business.
            </p>
          </div>

          <div className="pricingGrid">
            {/* STARTER */}

            <div className="pricingCard">
              <div className="pricingName">
                STARTER
              </div>

              <h3>For growing businesses</h3>

              <p className="pricingCardDescription">
                The essentials for handling customer conversations with AI.
              </p>

              <div className="price">
                $79 <small>/month</small>
              </div>

              <ul className="priceFeatures">
                <li>AI replies</li>
                <li>Business knowledge base</li>
                <li>Lead capture</li>
                <li>Basic follow-ups</li>
                <li>Customer database</li>
                <li>Human handover</li>
                <li>Basic analytics</li>
              </ul>

              <Link
                href="/auth/signup?plan=starter"
                className="button buttonDarkOutline priceButton"
              >
                Start Free →
              </Link>
            </div>

            {/* PRO */}

            <div className="pricingCard pricingCardPopular">
              <span className="popularBadge">
                MOST POPULAR
              </span>

              <div className="pricingName">
                PRO
              </div>

              <h3>For businesses ready to scale</h3>

              <p className="pricingCardDescription">
                Advanced tools for businesses with more sales activity.
              </p>

              <div className="price">
                $129 <small>/month</small>
              </div>

              <ul className="priceFeatures">
                <li>Everything in Starter</li>
                <li>Advanced AI</li>
                <li>Lead qualification</li>
                <li>Advanced follow-ups</li>
                <li>Team inbox</li>
                <li>Tags & notes</li>
                <li>Appointment workflows</li>
                <li>Advanced analytics</li>
              </ul>

              <Link
                href="/auth/signup?plan=pro"
                className="button buttonPrimary priceButton"
              >
                Start Free →
              </Link>
            </div>

            {/* AGENCY */}

            <div className="pricingCard">
              <div className="pricingName">
                AGENCY
                <span className="comingSoon">
                  COMING SOON
                </span>
              </div>

              <h3>For agencies</h3>

              <p className="pricingCardDescription">
                Multi-business tools for agencies and resellers.
              </p>

              <div className="price">
                $299 <small>/month</small>
              </div>

              <ul className="priceFeatures">
                <li>Multiple businesses</li>
                <li>Client management</li>
                <li>Agency dashboard</li>
                <li>White-label branding</li>
                <li>Reselling capabilities</li>
              </ul>

              <Link
                href="/auth/signup?plan=agency"
                className="button buttonDarkOutline priceButton"
              >
                Join Waitlist →
              </Link>
            </div>
          </div>

          <div className="setupBox">
            <div>
              <strong>$99 one-time setup fee</strong>

              <span>
                We handle the initial setup so you can get your AI sales
                assistant running without the technical headache.
              </span>
            </div>

            <div className="setupBoxRight">
              $99
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CREATOR PROGRAM
      ========================================================= */}

      <section className="section sectionDark">
        <div className="container creatorGrid">
          <div className="creatorCopy">
            <span className="sectionLabel">
              FOR CREATORS
            </span>

            <h2 className="sectionHeading">
              Create content once.
              <br />
              Earn{" "}
              <span className="gradientText">
                20% recurring commission.
              </span>
            </h2>

            <p>
              Creators can earn 20% of eligible recurring subscription
              revenue from customers they refer for as long as those
              customers remain active paying subscribers, subject to the
              Creator Program Terms.
            </p>

            <p className="creatorHighlight">
              The $99 setup fee is not commissionable.
            </p>

            <div className="actions">
              <Link
                href="/creators"
                className="button buttonPrimary"
              >
                Become a Creator →
              </Link>
            </div>
          </div>

          <div className="creatorCard">
            <div className="creatorCardTitle">
              EXAMPLE COMMISSIONS
            </div>

            <div className="creatorRow">
              <span>$79 Starter plan</span>
              <strong>$15.80/mo</strong>
            </div>

            <div className="creatorRow">
              <span>$129 Pro plan</span>
              <strong>$25.80/mo</strong>
            </div>

            <div className="creatorRow">
              <span>$299 Agency plan</span>
              <strong>$59.80/mo</strong>
            </div>

            <div className="creatorDisclaimer">
              Example only — not guaranteed earnings. Refunds,
              chargebacks, failed payments, discounts and other
              non-eligible revenue may affect commissions according to
              the Creator Program Terms.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================= */}

      <section className="section sectionDarkSoft">
        <div className="container">
          <div className="centerHeading">
            <span className="sectionLabel">
              FAQ
            </span>

            <h2 className="sectionHeading">
              Questions,
              <br />
              <span className="gradientText">
                answered.
              </span>
            </h2>
          </div>

          <div className="faqGrid">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="faqItem" key={faq.question}>
                  <button
                    className="faqQuestion"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                  >
                    <span>{faq.question}</span>

                    <span className="faqPlus">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faqAnswer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="ctaSection">
        <div className="container">
          <div className="ctaBox">
            <span className="sectionLabel">
              START SELLING SMARTER
            </span>

            <h2>
              Stop letting unanswered messages become{" "}
              <span className="gradientText">
                lost sales.
              </span>
            </h2>

            <p>
              Give your business an AI assistant that can answer,
              capture, qualify and follow up while keeping your team in
              control.
            </p>

            <div className="actions ctaButtons">
              <Link
                href="/auth/signup"
                className="button buttonPrimary"
              >
                Start Free →
              </Link>

              <Link
                href="/pricing"
                className="button buttonOutline"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function DashboardStat({
  icon,
  number,
  label,
  change,
}: {
  icon: string;
  number: string;
  label: string;
  change: string;
}) {
  return (
    <div className="statCard">
      <div className="statIcon">{icon}</div>

      <span className="statChange">
        {change}
      </span>

      <strong className="statNumber">
        {number}
      </strong>

      <span className="statLabel">
        {label}
      </span>
    </div>
  );
}

function Conversation({
  name,
  channel,
  status,
  dot,
}: {
  name: string;
  channel: string;
  status: string;
  dot: "green" | "pink" | "blue";
}) {
  return (
    <div className="conversation">
      <span className={`conversationDot ${dot}`} />

      <div>
        <span className="conversationName">
          {name}
        </span>

        <span className="conversationChannel">
          {channel}
        </span>
      </div>

      <span className="conversationStatus">
        {status}
      </span>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="stepCard">
      <span className="stepNumber">
        {number}
      </span>

      <div className="stepIcon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function Feature({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="featureCard">
      <div className="featureNumber">
        {number}
      </div>

      <div className="featureIcon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function DemoItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="demoListItem">
      <div className="demoListIcon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>

        <p>{text}</p>
      </div>
    </div>
  );
}

function WhyItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="whyItem">
      <strong>{title}</strong>

      <p>{text}</p>
    </div>
  );
}