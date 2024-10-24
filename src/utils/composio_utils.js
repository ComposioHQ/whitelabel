import { auth } from "../config/firebase";
import axios from "axios";

const linkAccount = async (user, appName) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            newUserId: user,
            redirectUrl: window.location.href,
            appName: appName
        };
        const newEntityURL = "/api/newentity"
        const response = await axios.post(newEntityURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === "yes") {
            alert(response.data.message);
        } else if (response.data.authenticated === "no") {
            return response.data.url;
        }
    } catch (error) {
        console.error("Full error object:", error);
        console.log("\n\nError :: ", error)
    }
}

const linkShopifyAccount = async (user, admin_api_access_token, shopSubDomain, appName) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            newUserId: user,
            admin_api_access_token: admin_api_access_token,
            shopSubDomain: shopSubDomain,
            appName: appName
        };
        const newEntityURL = "/api/newentityviaapi"
        const response = await axios.post(newEntityURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === true) {
            return true;
        } else if (response.data.authenticated === false) {
            return false;
        }
    } catch (error) {
        console.error("Full error object:", error);
        console.log("\n\nError :: ", error)
    }
}   

const checkConnectionStatus = async (appName, setIsConnected, entityId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post("/api/checkconnection",
            {
                appName: appName,
                entityId: entityId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        if (response.data.isConnected) {
            setIsConnected("Connected");
        }
        return response.data.isConnected;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.error || 'Server error');
        } else if (error.request) {
            console.error('Error request:', error.request);
            throw new Error('No response from server');
        } else {
            console.error('Error:', error.message);
            throw error;
        }
    }
}

const createNewTweet = async (entityId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post("/api/createtweet",
            { entity_id: entityId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data.result;
    } catch (error) {
        console.error("Error creating new tweet:", error);
        throw error;
    }
};

const starGithubRepo = async (entityId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post("/api/stargithubrepo",
            { entity_id: entityId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data.result;
    } catch (error) {
        console.error("Error starring GitHub repo:", error);
        throw error;
    }
};

const createClickupSpace = async (entityId, workspaceId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post("/api/createclickupspace",
            { entity_id: entityId, workspace_id: workspaceId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data.result;
    } catch (error) {
        console.error("Error creating Clickup space:", error);
        throw error;
    }
};

const getShopifyDetails = async (entityId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post("/api/getshopifydetails",
            { entity_id: entityId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error getting Shopify details:", error);
        throw error;
    }
};


export { checkConnectionStatus, linkAccount, createNewTweet, starGithubRepo, createClickupSpace, linkShopifyAccount, getShopifyDetails };
