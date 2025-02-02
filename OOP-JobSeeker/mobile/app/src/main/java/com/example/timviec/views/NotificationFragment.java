package com.example.timviec.views;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

import com.example.timviec.App;
import com.example.timviec.R;
import com.example.timviec.Utils;
import com.example.timviec.model.Notification;
import com.example.timviec.services.StateManagerService;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;


public class NotificationFragment extends Utils.BaseFragment {
    private StateManagerService stateManager = App.getContext().getStateManager();
    private ArrayList<Notification> notifications = stateManager.getNotifications();
    private NotificationListViewAdapter notificationListViewAdapter;
    private ListView notificationListView;
    private LinearLayout emptyNotiView;

    public NotificationFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_notification, container, false);

        notificationListView = view.findViewById(R.id.fragment_notification_list);
        emptyNotiView = view.findViewById(R.id.fragment_notification_empty);

        if (notifications.size() == 0) {
            emptyNotiView.setVisibility(View.VISIBLE);
            notificationListView.setVisibility(View.GONE);
        } else {
            emptyNotiView.setVisibility(View.GONE);
            notificationListView.setVisibility(View.VISIBLE);
        }

        view.findViewById(R.id.fragment_notification_read_all).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                for (Notification x : notifications) {
                    if (x.getUnread()) {
                        x.setUnread(false);
                    }
                }
                notificationListViewAdapter.notifyDataSetChanged();
            }
        });

        if (notifications.size() != 0) {
            if (notificationListView.getVisibility() == View.GONE) {
                notificationListView.setVisibility(View.VISIBLE);
                emptyNotiView.setVisibility(View.GONE);
            }
            notificationListViewAdapter = new NotificationListViewAdapter(notifications);
            notificationListView.setAdapter(notificationListViewAdapter);
        }

        return view;
    }

}

class NotificationListViewAdapter extends BaseAdapter {
    private final ArrayList<Notification> listItems;

    public NotificationListViewAdapter(ArrayList<Notification> listItems) {
        this.listItems = listItems;
    }

    @Override
    public int getCount() {
        return listItems.size();
    }

    @Override
    public Notification getItem(int i) {
        return listItems.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        View itemView = view != null ? view : View.inflate(viewGroup.getContext(), R.layout.notification_item, null);
        Notification item = getItem(i);
        DateFormat dateFormat = new SimpleDateFormat("HH:mm dd/MM/yyyy");

        ((TextView) itemView.findViewById(R.id.notification_card_title)).setText(item.getTitle());
        ((TextView) itemView.findViewById(R.id.notification_card_body)).setText(item.getBody());
        ((TextView) itemView.findViewById(R.id.notification_card_time)).setText(dateFormat.format(item.getTime()));
        if (!item.getUnread()) {
            itemView.findViewById(R.id.notification_card_unread).setVisibility(View.GONE);
        } else {
            itemView.findViewById(R.id.notification_card_unread).setVisibility(View.VISIBLE);
        }

        itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (item.getUnread()) {
                    item.setUnread(false);
                    notifyDataSetChanged();
                }
            }
        });

        return itemView;
    }
}