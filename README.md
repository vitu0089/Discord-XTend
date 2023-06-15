This software is used to simplify making discord bots. This is nested within the "Client" class. Upon creating a client through this module,
you get access to the variable "XTend". Through this, you can set permissions, change default responses to errors, make commands, and much more.


Commands:
If you wish to add commands, this can be done through Client.XTend.AddCommand(). If you need to remove excess commands so that your bots won't clutter itself,
you add all required commands, then run Client.XTend.ClearExcessCommands().


XGlobal:
For all your console management and error logging needs, this module will allow you to write to the console in pretty colors and timestamps. The uptime
variable on determines the timestamps, and when a client gets assigned, it will use the uptime of that to determine timestamps.

For error logging, use Sentry.io. Sentry is great for marking where the errors happened, when, and in what volumes. It's useful if your CLI is
moving a little fast for reading errors. When using Global.warn or Global.error, you will be sending a message to the Sentry servers, but if you haven't designated a "DSN" for the sentry module to work with, the module just gets excluded.


XMySQL:
To add on top, a custom MySQL handler. This comes with a built-in queue system. This system can be disabled in favor for custom methods if desired. You can enable caching, which will save the data that you request for a default 2 minutes. If desired, the RowHandler argument lets you run a function on every row of the requested data. This is not required, and will disable if left blank.


XQueue:
Use this system to create queues for handling data in the correct order. Every queue


Feel free to ask for help over on my support discord:
www.discord.gg/ZbBEPX4x6Z