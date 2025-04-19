import { ISiteAddress } from '@/models/policy.model';

export const SiteAddress = ({
  siteAddress,
  siteLegalName,
}: {
  siteAddress: ISiteAddress;
  siteLegalName: string;
}) => (
  <address className="not-italic mb-4">
    {siteLegalName}
    <br />
    {siteAddress.street}, {siteAddress.number}
    <br />({siteAddress.zip}) {siteAddress.city}, {siteAddress.region}
    <br />
    {siteAddress.country}
  </address>
);
