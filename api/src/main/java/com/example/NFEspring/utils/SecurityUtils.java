package com.example.NFEspring.utils;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

public class SecurityUtils {

    public static String createPbkdf2(String body, String salt, int iterations) throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(body.toCharArray(), salt.getBytes(), iterations, 64 * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");

        return SecurityUtils.toHex(skf.generateSecret(spec).getEncoded());
    }

    public static String createPbkdf2(Object body, String salt, int iterations) throws NoSuchAlgorithmException, InvalidKeySpecException {
        return SecurityUtils.createPbkdf2(
                SerializableUtils.toJson(body),
                salt,
                iterations
        );
    }

    private static String toHex(byte[] array) {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);

        int paddingLength = (array.length * 2) - hex.length();
        if (paddingLength > 0) {
            return String.format("%0" + paddingLength + "d", 0) + hex;
        } else {
            return hex;
        }
    }

}
