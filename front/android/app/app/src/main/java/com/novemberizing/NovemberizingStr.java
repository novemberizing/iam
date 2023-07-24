package com.novemberizing;

import android.net.Uri;
import android.text.Editable;

public class NovemberizingStr {
    public static Boolean equal(Editable x, Editable y) {
        String str = NovemberizingStr.get(x);
        if(str != null) {
            return str.equals(NovemberizingStr.get(y));
        }
        return y == null;
    }

    public static String get(Editable editable) {
        return editable != null ? editable.toString() : null;
    }
    public static String get(Uri uri) {
        return uri != null ? uri.toString() : null;
    }
}
