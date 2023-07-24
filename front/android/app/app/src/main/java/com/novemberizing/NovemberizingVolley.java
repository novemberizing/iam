package com.novemberizing;

import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class NovemberizingVolley {
    private static NovemberizingVolley instance = null;

    public static void gen(Context context) {
        synchronized (NovemberizingVolley.class) {
            if(instance == null) {
                instance = new NovemberizingVolley(context);
            }
        }
    }

    public static Request<String> str(String url, Response.Listener<String> success, Response.ErrorListener fail) {
        return instance.queue.add(new StringRequest(url, success, fail));
    }

    public static <T> Request<T> post(String url, String body, Class<T> c, Response.Listener<T> success, Response.ErrorListener fail) {
        return instance.queue.add(new Request<T>(Request.Method.POST, url, fail) {

            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
            }

            @Override
            public byte[] getBody() throws AuthFailureError {
                return body == null ? null : body.getBytes(StandardCharsets.UTF_8);
            }

            @Override
            protected Response<T> parseNetworkResponse(NetworkResponse response) {
                try {
                    Gson gson = NovemberizingGson.get();
                    String json = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
                    return Response.success(gson.fromJson(json, c), HttpHeaderParser.parseCacheHeaders(response));
                } catch (UnsupportedEncodingException | JsonSyntaxException e) {
                    return Response.error(new ParseError(e));
                }
            }

            @Override
            protected void deliverResponse(T response) {
                success.onResponse(response);
            }
        });
    }

    public static <T> Request<T> json(String url, Map<String, String> headers, Class<T> c, Response.Listener<T> success, Response.ErrorListener fail) {
        return instance.queue.add(new Request<T>(Request.Method.GET, url, fail) {
            @Override
            public Map<String, String> getHeaders() {
                return headers;
            }

            @Override
            protected Response<T> parseNetworkResponse(NetworkResponse response) {
                try {
                    Gson gson = NovemberizingGson.get();
                    String json = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
                    return Response.success(gson.fromJson(json, c), HttpHeaderParser.parseCacheHeaders(response));
                } catch (UnsupportedEncodingException | JsonSyntaxException e) {
                    return Response.error(new ParseError(e));
                }
            }

            @Override
            protected void deliverResponse(T response) {
                success.onResponse(response);
            }
        });
    }

    public static <T> Request<T> json(String url, Class<T> c, Response.Listener<T> success, Response.ErrorListener fail) {
        return instance.queue.add(new Request<T>(Request.Method.GET, url, fail) {
            @Override
            protected Response<T> parseNetworkResponse(NetworkResponse response) {
                try {
                    Gson gson = NovemberizingGson.get();
                    String json = new String(response.data, HttpHeaderParser.parseCharset(response.headers));
                    return Response.success(gson.fromJson(json, c), HttpHeaderParser.parseCacheHeaders(response));
                } catch (UnsupportedEncodingException | JsonSyntaxException e) {
                    return Response.error(new ParseError(e));
                }
            }

            @Override
            protected void deliverResponse(T response) {
                success.onResponse(response);
            }
        });
    }

    private final RequestQueue queue;

    private NovemberizingVolley(Context context) {
        this.queue = Volley.newRequestQueue(context);
    }
}
