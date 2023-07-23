package com.novemberizing;

import android.net.Uri;
import android.text.Editable;

public class NovemberizingStr {
    public static String get(Editable editable) {
        return editable != null ? editable.toString() : null;
    }
    public static String get(Uri uri) {
        return uri != null ? uri.toString() : null;
    }
}
