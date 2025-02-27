import { CalendarDots, Siren } from "@phosphor-icons/react";
import { ArrowsClockwise, Buildings, ChatText, Files, Megaphone, NotePencil, Package, SquaresFour, UserCirclePlus, UserList,UserCirclec ,UserCircle, Gift } from "phosphor-react";

export const SEARCHABLE_ROUTES = [
    // Dashboard
    {
      category: 'Navigation',
      items: [
        { 
          name: 'Dashboard', 
          icon: SquaresFour,
          path: '/',
          breadcrumb: ['Dashboard']
        }
      ]
    },
  
    // Flat Management Section
    {
      category: 'Flat Management',
      items: [
        { 
          name: 'Flat Management', 
          icon: Buildings,
          path: '/flatmain',
          breadcrumb: ['Flat Management']
        },
        { 
          name: 'Add Flat', 
          icon: Buildings,
          path: '/flatmain',
          breadcrumb: ['Flat Management', 'Add Flat']
        },
        { 
            name: 'Export Flat', 
            icon: Buildings,

            path: '/flatmain',
            breadcrumb: ['Flat Management', 'Export']
          }
      ]
    },
  
    // User Requests Section
    {
      category: 'User Requests',
      items: [
        { 
          name: 'User Requests', 
          icon: UserCirclePlus ,
          path: '/UserRequests',
          breadcrumb: ['User Requests']
        },
        { 
            name: 'Export User Requests', 
            icon: UserCirclePlus ,

            path: '/UserRequests',
            breadcrumb: ['User Requests','Export']
          }
      ]
    },
  
    // Facility Section
    {
      category: 'Facility',
      items: [
        { 
          name: 'Facility', 
          icon: Buildings,

          path: '/Facility',
          breadcrumb: ['Facility']
        },
        { 
          name: 'Add Amenity',
          icon: Buildings,
 
          path: '/Amenityform',
          breadcrumb: ['Facility', 'Add Amenity']
        },
        { 
            name: 'Export Facility', 
            icon: Buildings,

            path: '/Facility',
            breadcrumb: ['Facility', 'Export']
          }
        // { 
        //   name: 'Edit Amenity', 
        //   path: '/Amenityform',
        //   breadcrumb: ['Facility', 'Edit Amenity']
        // }
      ]
    },
  
    // Bookings Section
    {
      category: 'Bookings',
      items: [
        { 
          name: 'Bookings', 
          icon: CalendarDots ,
          path: '/Booking',
          breadcrumb: ['Bookings']
        },
        { 
            name: 'Amenities',
            icon: CalendarDots ,
 
            path: '/Booking',
            breadcrumb: ['Bookings','Amenities']
          },
        { 
          name: 'Add Amenity Booking ',
          icon: CalendarDots ,
 
          path: '/Booking',
          breadcrumb: ['Bookings', 'Amenities','Add Amenity Booking']
        },
        { 
            name: 'Export Amenity Booking ', 
            icon: CalendarDots ,

            path: '/Booking',
            breadcrumb: ['Bookings', 'Amenities','Export']
          }

      ]
    },

    //Services Section
    {
        category: 'Services',
        items: [
          { 
            name: 'Services', 
            icon: CalendarDots ,

            path: '/Booking',
            breadcrumb: ['Bookings']
          },
         
          { 
            name: 'Add Services Booking ',
            icon: CalendarDots ,
 
            path: '/Booking',
            breadcrumb: ['Bookings', 'Amenities','Add Services Booking']
          },
          { 
              name: 'Export Services Booking ', 
              icon: CalendarDots ,

              path: '/Booking',
              breadcrumb: ['Bookings', 'Amenities','Export']
            }
  
        ]
      },

  
    // Visitors Section
    {
      category: 'Visitors',
      items: [
        { 
          name: 'Guests', 
          icon: UserList  ,
          path: '/Guest',
          breadcrumb: ['Visitors', 'Guests']
        },
        { 
            name: 'Export Guests ', 
            icon: CalendarDots ,

            path: '/Guest',
            breadcrumb: ['Visitors', 'Guests','Export']
          }
        ,
        { 
          name: 'Helpers', 
          icon: UserList  ,

          path: '/Helper',
          breadcrumb: ['Visitors', 'Helpers']
        },
        { 
            name: 'Export Helpers ', 
            icon: CalendarDots ,

            path: '/Helper',
            breadcrumb: ['Visitors', 'Helpers','Export']
          }
        ,
        { 
          name: 'Delivery', 
          icon: UserList  ,

          path: '/Delivery',
          breadcrumb: ['Visitors', 'Delivery']
        },
        { 
            name: 'Export Delivery ', 
            icon: CalendarDots ,

            path: '/Delivery',
            breadcrumb: ['Visitors', 'Delivery','Export']
          }
        ,
        { 
          name: 'Cab', 
          icon: UserList  ,

          path: '/Cab',
          breadcrumb: ['Visitors', 'Cab']
        },
        { 
            name: 'Export Cab ', 
            icon: CalendarDots ,

            path: '/Cab',
            breadcrumb: ['Visitors', 'Cab','Export']
          }
        ,
        { 
          name: 'Other Visitors', 
          icon: UserList  ,

          path: '/Other',
          breadcrumb: ['Visitors', 'Other']
        },
        { 
            name: 'Export Others ', 
            icon: CalendarDots ,

            path: '/Other',
            breadcrumb: ['Visitors', 'Other','Export']
          }
        ,

      ]
    },
  
    // Parcels Section
    {
      category: 'Parcels',
      items: [
        { 
          name: 'Parcels', 
          icon: Package  ,
          path: '/Parcels',
          breadcrumb: ['Parcels']
        },
        { 
            name: 'Export Parcels ', 
            icon: CalendarDots ,

            path: '/Parcels',
            breadcrumb: [ 'Parcels','Export']
          }
      ]
    },
  
    // Notices Section
    {
      category: 'Notices',
      items: [
        { 
          name: 'Notices',
            icon: Megaphone  , 
          path: '/Notices',
          breadcrumb: ['Notices']
        },
        { 
          name: 'Add Notice',
          icon: Megaphone  , 
 
          path: '/Noticeform',
          breadcrumb: ['Notices', 'Add Notice']
        },
        { 
            name: 'Export Notice', 
            icon: Megaphone  , 

            path: '/Notices',
            breadcrumb: ['Notices', 'Export']
          }
      ]
    },
  
    // SOS History
    {
      category: 'Emergency',
      items: [
        { 
          name: 'SOS History', 
          icon: Siren  ,
          path: '/sosHistory',
          breadcrumb: ['SOS History']
        },
        { 
            name: 'Export SOS History', 
            icon: Siren  ,

            path: '/sosHistory',
            breadcrumb: ['SOS History','Export']
          }
      ]
    },
  
    // Feedback Section
    {
      category: 'Feedback',
      items: [
        { 
          name: 'Feedback', 
          icon: ChatText  ,
          path: '/feedback',
          breadcrumb: ['Feedback']
        },
       
        { 
          name: 'Export Feedback',
          icon: ChatText  ,
 
          path: '/feedback',
          breadcrumb: ['Feedback', 'Export']
        },
        // { 
        //   name: 'Not Found Feedback', 
        //   path: '/notFoundFeedback',
        //   breadcrumb: ['Feedback', 'Not Found']
        // }
      ]
    },
  
    // Special Requests
    {
      category: 'Special Requests',
      items: [
        { 
          name: 'Special Requests', 
          icon: NotePencil  ,
          path: '/special_request',
          breadcrumb: ['Special Requests']
        },
        { 
          name: ' Export Special Request ',
          icon: NotePencil  ,
 
          path: '/special_request',
          breadcrumb: ['Special Requests', 'Export']
        }
      ]
    },
  
    // Documents
    {
      category: 'Documents',
      items: [
        { 
          name: 'Documents', 
          icon: Files  ,
          path: '/document',
          breadcrumb: ['Documents']
        },
        { 
            name: 'Add Documents', 
            icon: Files  ,
            path: '/document',
            breadcrumb: ['Documents', 'Add']
          },
        { 
            name: ' Export Documents ',
            icon: Files  ,
   
            path: '/document',
            breadcrumb: ['Documents', 'Export']
          }
      ]
    },
  
    // Construction
    {
      category: 'Construction',
      items: [
        { 
          name: 'Construction Update', 
          icon:ArrowsClockwise,
          path: '/construction',
          breadcrumb: ['Construction Update']
        },
        
        { 
          name: 'Add Construction Update', 
          icon:ArrowsClockwise,

          path: '/constructionupdate',
          breadcrumb: ['Construction Update', 'Add']
        },
        { 
            name: 'Export Construction ', 
            icon:ArrowsClockwise,
  
            path: '/construction',
            breadcrumb: ['Construction Update', 'Export']
          }
      ]
    },
  
    // Users Section
    {
      category: 'Users',
      items: [
        { 
          name: 'Staff Users', 
          icon: UserCircle  ,
          path: '/user',
          breadcrumb: ['Users', 'Staff']
        },
        { 
            name: 'Export Staff Users', 
            icon: UserCircle  ,
            path: '/user',
            breadcrumb: ['Users', 'Staff','Export']
          },
        
        
        { 
          name: 'Residents', 
          icon: UserCircle  ,

          path: '/Resident',
          breadcrumb: ['Users', 'Residents']
        },
        { 
            name: 'Export Residents', 
            icon: UserCircle  ,
            path: '/Resident',
            breadcrumb: ['Users', 'Resident','Export']
          },
        { 
          name: 'Guest Login', 
          icon: UserCircle  ,

          path: '/GuestLogin',
          breadcrumb: ['Users', 'Guest Login']
        },
        { 
            name: 'Export Guest Login', 
            icon: UserCircle  ,
  
            path: '/GuestLogin',
            breadcrumb: ['Users', 'Guest Login','Export']
          }
      ]
    },
  
    // Helper Management
    {
      category: 'Helper Management',
      items: [
        // { 
        //   name: 'Add Helper', 
        //   icon: UserCircle  ,

        //   path: '/AddHelper',
        //   breadcrumb: ['Users', 'Helpers', 'Add Helper']
        // },
        { 
            name: 'Export Helpers', 
            icon: UserCircle  ,
  
            path: '/AddHelper',
            breadcrumb: ['Users', 'Helpers', 'Export']
          },
        { 
          name: 'Add Helper', 
          icon: UserCircle  ,

          path: '/AddNewHelper',
          breadcrumb: ['Users', 'Helpers', 'New Helper']
        }
      ]
    },
  
    // Guard Management
    {
      category: 'Guard Management',
      items: [
        // { 
        //   name: 'Add Guard', 
        //   icon: UserCircle  ,

        //   path: '/AddGuard',
        //   breadcrumb: ['Users', 'Guards', 'Add Guard']
        // },
        { 
          name: 'Add Guards', 
          icon: UserCircle  ,

          path: '/AddNewGuard',
          breadcrumb: ['Users', 'Guards', 'Add Guard']
        },
        { 
            name: 'Export Guard', 
            icon: UserCircle  ,
  
            path: '/AddGuard',
            breadcrumb: ['Users', 'Guards', 'Export']
          },
        // { 
        //   name: 'Edit Guard', 
        //   path: '/AddNewGuard/:id',
        //   breadcrumb: ['Users', 'Guards', 'Edit Guard']
        // }
      ]
    },
  
    // Support
    {
      category: 'Support',
      items: [
        { 
          name: 'Support', 
          icon: Gift   ,
          path: '/support',
          breadcrumb: ['Support']
        },
        { 
            name: 'Export Support', 
            icon: Gift   ,
            path: '/support',
            breadcrumb: ['Support',"Export"]
          },
        // { 
        //   name: 'Support View', 
        //   path: '/support_view/:id',
        //   breadcrumb: ['Support', 'View']
        // }
      ]
    },
    //Referrals
    {
        category:"Referrals",
        items:[
            { 
                name: 'Referrals', 
                icon: UserCircle  ,
      
                path: '/referrals',
                breadcrumb: ['Referrals']
              },
              { 
                  name: 'Export Referrals', 
                  icon: UserCircle  ,
                  path: '/referrals',
                  breadcrumb: ['Referrals','Export']
                },
        ]
    },
  
    // Rental Requests
    {
      category: 'Rental Requests',
      items: [
        { 
          name: 'Rental Requests', 
          icon: NotePencil,
          path: '/Rental_request',
          breadcrumb: ['Rental Requests']
        },
        { 
          name: 'Owner', 
          icon: NotePencil,

          path: '/Owner',
          breadcrumb: ['Rental Requests', 'Owner']
        },
        { 
          name: 'Tenant', 
          icon: NotePencil,

          path: '/Tenant',
          breadcrumb: ['Rental Requests', 'Tenant']
        }
      ]
    }
  ];
  
  export default SEARCHABLE_ROUTES;