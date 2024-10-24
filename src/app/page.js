"use client"
import Image from "next/image";
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('../components/Navbar'), { ssr: true })
const Footer = dynamic(() => import('../components/Footer'), { ssr: true })
const ResponsiveMessage = dynamic(() => import('../components/ResponsiveMessage'), { ssr: false })
const DemoApp = dynamic(() => import('../components/DemoApp'), { ssr: true })
const LoginAlert = dynamic(() => import('../components/LoginAlert'), { ssr: false })

import { SnackbarProvider } from 'notistack'
import DemoAppRequest from "../components/DemoAppRequest";
import twitterLogo from "../assets/appLogos/twitter-logo.jpg";
import githubLogo from "../assets/appLogos/github-logo.jpg";
import jiraLogo from "../assets/appLogos/jira-logo.jpg";
import clickupLogo from "../assets/appLogos/clickup-logo.jpg";
import shopifyLogo from "../assets/appLogos/shopify-logo.png";
import { createNewTweet, starGithubRepo, createClickupSpace, getShopifyDetails } from "../utils/composio_utils";
import { useState, useEffect } from "react";
import { signUpWithGoogle } from "../utils/firebase_utils";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

import SkeletonLoader from "../components/SkeletonLoader";



export default function Home() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (loading) {
    return <SkeletonLoader />
  }
  return (
    <SnackbarProvider maxSnack={3}>
      {/* <ResponsiveMessage /> */}
      <Navbar user={user}/>
      <div className="h-screen">
        <LoginAlert open={open} setOpen={setOpen} action={initiateLogin} />
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-14 items-center justify-center 2xl:mx-36 xl:mx-24 md:mx-14 mt-32">
          <DemoApp actionDescription="This action will create a tweet saying 'Hey! I used @composiohq to create this tweet' from connected account." setOpen={setOpen} user={user} appName="TWITTER" logo={twitterLogo} title="Create Simple Tweet App" description="Uses Twitter Tool to create a tweet from connected account" action={createNewTweet} />
          <DemoApp actionDescription="This action will star the composioHQ/composio repository from connected account" setOpen={setOpen} user={user} appName="GITHUB" logo={githubLogo} title="Star a repo on Github" description="Uses Github Tool to star a repo from connected account" action={starGithubRepo} />
          <DemoApp actionDescription="This action will create a new space in Clickup from connected account" setOpen={setOpen} user={user} appName="CLICKUP" logo={clickupLogo} title="Create A New Space" description="Uses Clickup Tool to create a new space from connected account" action={createClickupSpace} logoRounded={true} inputRequired={true} inputValue="workspace id" />
          <DemoApp actionDescription="This action will get the basic shop details from connected account" setOpen={setOpen} user={user} appName="SHOPIFY" logo={shopifyLogo} title="Get Shop Details" description="Uses Shopify Tool to retrieve basic shop information from connected account" action={getShopifyDetails} connectViaAPI={true}  />
          {/* <DemoApp actionDescription="This action will create an issue in Jira from connected account." setOpen={setOpen} user={user} appName="JIRA" logo={jiraLogo} title="Create An Issue" description="Uses Jira Tool to create an issue from connected account" action={createNewTweet}/> */}
          <DemoAppRequest user={user} />
        </div>
      </div>
      <Footer />
    </SnackbarProvider>
  );
}
