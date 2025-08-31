package io.github.lujian213.timerecorder.utils;

import java.nio.charset.StandardCharsets;

public class CaseTimeRecorderUtils {
    public static byte[] toBytesWithBOM(String content) {
        if (content == null) {
            return null;
        }
        byte[] bom = new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF };
        byte[] contentBytes = content.getBytes(StandardCharsets.UTF_8);
        byte[] result = new byte[bom.length + contentBytes.length];
        System.arraycopy(bom, 0, result, 0, bom.length);
        System.arraycopy(contentBytes, 0, result, bom.length, contentBytes.length);
        return result;
    }
}
