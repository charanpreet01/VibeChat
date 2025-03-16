import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {

        set({ isUsersLoading: true });

        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data.filteredUsers })

        } catch (error) {
            console.log((`Error in getUsers: ${error}`));
            toast.error("Something went wrong")

        } finally {
            set({ isUsersLoading: false });
        }


    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data.messages })

        } catch (error) {
            console.log((`Error in getMessages: ${error}`));
            toast.error("Something went wrong");
        } finally {
            set({ isMessagesLoading: false });
        }

    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data.newMessage] });

        } catch (error) {
            console.log((`Error in sendMessage: ${error}`));
            toast.error("Something went wrong");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {

            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            
            if (!isMessageSentFromSelectedUser) return;
            
            set({ messages: [...get().messages, newMessage] });
        })

    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })

}))