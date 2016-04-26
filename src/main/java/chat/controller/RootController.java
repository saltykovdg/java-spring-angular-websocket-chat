package chat.controller;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import chat.model.UserMessage;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class RootController {
    private static final int MESSAGES_CACHE = 100;
    private List<UserMessage> messages = new ArrayList<>();

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public UserMessage message(UserMessage userMessage) throws Exception {
        userMessage.setDate(DateFormatUtils.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd HH:mm:ss"));
        messages.add(0, userMessage);
        if (messages.size() > MESSAGES_CACHE) {
            messages.remove(MESSAGES_CACHE);
        }
        return userMessage;
    }

    @SubscribeMapping("/chat")
    public List<UserMessage> subscribeMapping() {
        return messages;
    }
}
