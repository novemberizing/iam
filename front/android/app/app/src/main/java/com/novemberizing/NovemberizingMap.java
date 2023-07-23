package com.novemberizing;

import com.novemberizing.object.NovemberizingPair;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class NovemberizingMap {

    @SafeVarargs
    public static <K, V> Map<K, V> gen(NovemberizingPair<K, V>... entries) {
        LinkedHashMap<K, V> map = new LinkedHashMap<>();

        for(NovemberizingPair<K, V> entry : entries) {
            map.put(entry.first(), entry.second());
        }

        return map;
    }
}
