"use client"
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('../components/Navbar'), { ssr: true })
const Footer = dynamic(() => import('../components/Footer'), { ssr: true })
const ResponsiveMessage = dynamic(() => import('../components/ResponsiveMessage'), { ssr: false })
const DemoApp = dynamic(() => import('../components/DemoApp'), { ssr: true })
const LoginAlert = dynamic(() => import('../components/LoginAlert'), { ssr: false })

import { SnackbarProvider, useSnackbar } from 'notistack'
import DemoAppRequest from "../components/DemoAppRequest";
import TWITTER_LOGO from "../assets/appLogos/twitter-logo.jpg";
import GITHUB_LOGO from "../assets/appLogos/github-logo.jpg";
import JIRA_LOGO from "../assets/appLogos/jira-logo.jpg";
import CLICKUP_LOGO from "../assets/appLogos/clickup-logo.jpg";
import SHOPIFY_LOGO from "../assets/appLogos/shopify-logo.png";
import { createNewTweet, starGithubRepo, createClickupSpace, getShopifyDetails } from "../utils/composio_utils";
import { useState, useEffect } from "react";
import { signUpWithGoogle } from "../utils/firebase_utils";
import { getAppsData } from "../utils/apps";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

import SkeletonLoader from "../components/SkeletonLoader";



export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appsData, setAppsData] = useState([]);
  const initiateLogin = async () => {
    try {
      await signUpWithGoogle();
    } catch (error) {
      console.error("Error during sign up:", error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchAppsData = async () => {
      try {
        const data = await getAppsData();
        setAppsData(data);
      } catch (error) {
        console.error('Error fetching apps data:', error);
        enqueueSnackbar('Error fetching apps data', { variant: 'error' });
      }
    };

    fetchAppsData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SkeletonLoader />
  }

  const actionMap = {
    starGithubRepo,
    createNewTweet,
    getShopifyDetails,
    createClickupSpace,
  };

  const logoMap = {
    TWITTER: TWITTER_LOGO,
    GITHUB: GITHUB_LOGO,
    JIRA: JIRA_LOGO,
    CLICKUP: CLICKUP_LOGO,
    SHOPIFY: SHOPIFY_LOGO,
  };

  return (
    <SnackbarProvider maxSnack={3} id="main-container">
      <Navbar user={user} />
      <div className="h-screen">
        <LoginAlert open={open} setOpen={setOpen} action={initiateLogin} />
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-14 items-center justify-center 2xl:mx-36 xl:mx-24 md:mx-14 mt-32">
          {appsData.map((app, index) => (
            !app.disable && (
              <DemoApp
                key={index}
                setOpen={setOpen}
                user={user}
                actionExecutedMessage={app.actionExecutedMessage}
                actionDescription={app.actionDescription}
                appName={app.appName}
                logo={logoMap[app.appName]}
                title={app.title}
                description={app.description}
                action={actionMap[app.action]}
                demoApp={app.demoApp}
                connectViaAPI={app.connectViaAPI}
                logoRounded={app.logoRounded}
                inputRequired={app.inputRequired}
                inputValue={app.inputValue}
              />
            )
          ))}
        </div>
      </div>
      <Footer />
    </SnackbarProvider>
  );
}
