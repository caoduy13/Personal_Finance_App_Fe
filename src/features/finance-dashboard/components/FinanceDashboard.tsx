import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/shared/constants/routes";
import { NAV_TABS, type NavTab } from "../mockData";
import type { ProfileSection } from "../types";
import "../finance-dashboard.css";
import {
  FinanceDashboardProvider,
  useFinanceDashboard,
} from "../context/FinanceDashboardContext";
import { FinanceTopBar } from "./FinanceTopBar";
import { ProfileScreen } from "./ProfileScreen";
import { HireBookkeeperTab } from "./tabs/HireBookkeeperTab";
import { OverviewTab } from "./tabs/OverviewTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { TransactionsTab } from "./tabs/TransactionsTab";

function FinanceDashboardInner() {
  const navigate = useNavigate();
  const { tr } = useFinanceDashboard();
  const [activeTab, setActiveTab] = useState<NavTab>("Overview");
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profileSection, setProfileSection] =
    useState<ProfileSection>("profile");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [isDark]);

  const openProfile = (section: ProfileSection = "profile") => {
    setProfileSection(section);
    setShowProfile(true);
  };

  const handleSignOut = () => {
    toast.success(tr("signOut"));
    navigate(ROUTES.LOGIN);
  };

  const tabLabels: Record<NavTab, string> = {
    Overview: tr("overview"),
    Transactions: tr("transactions"),
    Reports: tr("reports"),
    "Hire Bookkeeper": tr("hireBookkeeper"),
  };

  const renderTabContent = () => {
    if (showProfile) {
      return (
        <ProfileScreen
          section={profileSection}
          onBack={() => setShowProfile(false)}
          onSectionChange={setProfileSection}
        />
      );
    }

    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Transactions":
        return <TransactionsTab searchQuery={searchQuery} />;
      case "Reports":
        return <ReportsTab />;
      case "Hire Bookkeeper":
        return <HireBookkeeperTab />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-50",
      )}
    >
      <FinanceTopBar
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onOpenProfile={openProfile}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {!showProfile && (
        <nav className="mx-auto max-w-7xl overflow-x-auto border-b border-neutral-100 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950 sm:px-6 lg:px-8">
          <ul className="flex gap-6 sm:gap-10">
            {NAV_TABS.map((tab) => (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative whitespace-nowrap pb-3 pt-3 text-sm font-medium transition",
                    activeTab === tab
                      ? "font-semibold text-neutral-900 dark:text-white"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300",
                  )}
                >
                  {tabLabels[tab]}
                  {activeTab === tab ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-neutral-900 dark:bg-white" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {renderTabContent()}
      </main>
    </div>
  );
}

export function FinanceDashboard() {
  return (
    <FinanceDashboardProvider>
      <FinanceDashboardInner />
    </FinanceDashboardProvider>
  );
}
